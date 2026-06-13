import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';

import { type LotView, type MarketResourceSummary, LotState, type TradeQuoteResponse } from '../../../api/types.js';
import { Network } from '../../../config/types.js';
import { NoopLogger } from '../../../logger/noop.logger.js';
import {
    type BalanceResult,
    type FreeLotResult,
    LotAction,
    LotResultKind,
    type PaidLotResult,
} from '../../../services/types.js';
import type { AppContext } from '../../../types.js';
import { TxStatus } from '../../../wallet/types.js';
import { registerGetBalanceTool } from '../../account/get-balance/get-balance.js';
import { registerBuyLotTool } from '../buy-lot/buy-lot.js';
import { registerCancelLotTool } from '../cancel-lot/cancel-lot.js';
import { registerCreateLotTool } from '../create-lot/create-lot.js';
import { registerGetLotTool } from '../get-lot/get-lot.js';
import { registerListLotsTool } from '../list-lots/list-lots.js';
import { registerListMyLotsTool } from '../list-mine/list-my-lots.js';
import { registerGetMarketsTool } from '../markets/get-markets.js';
import { registerQuoteBuyTool } from '../quote-buy/quote-buy.js';

interface ToolResult {
    content: Array<{ type: string; text: string }>;
}

type Register = (server: McpServer, context: AppContext) => void;

const RESOURCES = { 3: 'Silica' };
const HUB = '0x4444444444444444444444444444444444444444';

function capture(register: Register, contextPartial: Record<string, unknown>): (args: never) => Promise<ToolResult> {
    const appConfig = { load: async () => ({ resources: RESOURCES }) };
    const context = { appConfig, logger: new NoopLogger(), ...contextPartial } as unknown as AppContext;
    let captured: ((args: never) => Promise<ToolResult>) | null = null;
    const server = {
        registerTool(_name: string, _def: unknown, handler: (args: never) => Promise<ToolResult>): void {
            captured = handler;
        },
    } as unknown as McpServer;
    register(server, context);
    if (captured === null) {
        throw new Error('tool was not registered');
    }
    return captured;
}

const freeLot: FreeLotResult = {
    kind: LotResultKind.Free,
    action: LotAction.Create,
    lotId: 'lot-1',
    state: LotState.Delivering,
    arrivalAt: 1704,
};

const paidBuy: PaidLotResult = {
    kind: LotResultKind.Paid,
    action: LotAction.Buy,
    lotId: 'lot-1',
    signId: 9,
    state: LotState.Open,
    tokenId: '20',
    totalAmount: '10000000000000000000',
    burnAmount: '1000000000000000000',
    recipients: [HUB],
    payouts: ['9000000000000000000'],
    txHash: '0xbuy',
    approveTxHash: '0xapprove',
    status: TxStatus.Success,
    blockNumber: '100',
};

const lot: LotView = {
    id: 'lot-1',
    hubTokenId: '5',
    hubX: 2,
    hubY: 0,
    sellerAddress: '0xseller',
    resourceId: 3,
    listed: '100',
    remaining: '80',
    pricePerUnit: '0.5',
    tradeFeePct: 0,
    state: LotState.Open,
    distanceFromCenter: 3,
    createdAt: 1700,
};

const market: MarketResourceSummary = {
    hubTokenId: '5',
    hubX: 2,
    hubY: 0,
    resourceId: 3,
    openLots: 2,
    openRemaining: '150',
    minPricePerUnit: '0.4',
    tradeFeePct: 0,
    incomingLots: 1,
    incomingRemaining: '50',
    distanceFromCenter: 3,
};

describe('create_lot / cancel_lot tools', () => {
    it('reports a free create', async () => {
        const handler = capture(registerCreateLotTool, { trade: { createLot: async () => freeLot } });
        const result = await handler({ chain: [], resourceId: 3, value: '100', pricePerUnit: '0.5' } as never);
        expect(result.content[0]?.text).toMatch(/Free create on lot lot-1/);
        expect(result.content[0]?.text).toMatch(/delivering/);
    });

    it('reports a free cancel', async () => {
        const handler = capture(registerCancelLotTool, {
            trade: { cancelLot: async () => ({ ...freeLot, action: LotAction.Cancel, state: LotState.Reverted }) },
        });
        const result = await handler({ lotId: 'lot-1', chain: null } as never);
        expect(result.content[0]?.text).toMatch(/Free cancel on lot lot-1/);
    });
});

describe('buy_lot tool', () => {
    it('reports a paid buy with the approve and buy tx', async () => {
        const handler = capture(registerBuyLotTool, { trade: { buyLot: async () => paidBuy } });
        const result = await handler({ lotId: 'lot-1', chain: [], value: '100' } as never);
        expect(result.content[0]?.text).toMatch(/Paid buy on lot lot-1/);
        expect(result.content[0]?.text).toMatch(/10 \$CPU/);
        expect(result.content[0]?.text).toMatch(/approve tx 0xapprove/);
        expect(result.content[0]?.text).toMatch(/buy tx 0xbuy/);
    });

    it('propagates service errors', async () => {
        const handler = capture(registerBuyLotTool, {
            trade: {
                buyLot: async () => {
                    throw new Error('LotNotBuyable');
                },
            },
        });
        await expect(handler({ lotId: 'lot-1', chain: [], value: '100' } as never)).rejects.toThrow(/LotNotBuyable/);
    });
});

describe('quote_buy tool', () => {
    it('summarizes a routed buy quote', async () => {
        const quote: TradeQuoteResponse = {
            lotId: 'lot-1',
            resourceId: 3,
            sellerAddress: '0xseller',
            pricePerUnit: '0.5',
            value: '100',
            remaining: '80',
            routed: true,
            totalDistance: 4,
            totalTimeSec: 8,
            fee: {
                total: '55',
                burn: '1',
                recipients: ['0xseller', HUB],
                payouts: ['50', '4'],
                totalWei: '55000000000000000000',
                burnWei: '1000000000000000000',
                payoutsWei: ['50000000000000000000', '4000000000000000000'],
            },
        };
        const handler = capture(registerQuoteBuyTool, { trade: { quoteBuy: async () => quote } });
        const result = await handler({ lotId: 'lot-1', value: '100', chain: [] } as never);
        expect(result.content[0]?.text).toMatch(/Buy quote for lot lot-1/);
        expect(result.content[0]?.text).toMatch(/Silica \(#3\)/);
        expect(result.content[0]?.text).toMatch(/Total 55 \$CPU/);
    });
});

describe('discovery read tools', () => {
    it('list_lots renders a lot line', async () => {
        const handler = capture(registerListLotsTool, { trade: { listLots: async () => [lot] } });
        const result = await handler({} as never);
        expect(result.content[0]?.text).toMatch(/1 lot/);
        expect(result.content[0]?.text).toMatch(/lot lot-1 \[open\]/);
        expect(result.content[0]?.text).toMatch(/Silica \(#3\)/);
        expect(result.content[0]?.text).toMatch(/80\/100/);
    });

    it('get_markets renders a scout row', async () => {
        const handler = capture(registerGetMarketsTool, { trade: { getMarkets: async () => [market] } });
        const result = await handler({} as never);
        expect(result.content[0]?.text).toMatch(/Hub 5 @\(2,0\)/);
        expect(result.content[0]?.text).toMatch(/2 open/);
        expect(result.content[0]?.text).toMatch(/from 0.4 \$CPU/);
    });

    it('get_lot renders a single lot', async () => {
        const handler = capture(registerGetLotTool, { trade: { getLot: async () => lot } });
        const result = await handler({ lotId: 'lot-1' } as never);
        expect(result.content[0]?.text).toMatch(/lot lot-1 \[open\]/);
    });

    it('list_my_lots shows the count and state filter', async () => {
        const handler = capture(registerListMyLotsTool, { trade: { listMyLots: async () => [lot] } });
        const result = await handler({ state: LotState.Open } as never);
        expect(result.content[0]?.text).toMatch(/1 lot\(s\) · state=open/);
    });
});

describe('get_balance tool', () => {
    it('reports $CPU and gas', async () => {
        const balance: BalanceResult = {
            address: '0xdead',
            network: Network.ETHEREUM,
            chainId: 1,
            cpu: '12.5',
            cpuWei: '12500000000000000000',
            native: '0.3',
            nativeWei: '300000000000000000',
        };
        const handler = capture(registerGetBalanceTool, { balance: { getBalances: async () => balance } });
        const result = await handler({} as never);
        expect(result.content[0]?.text).toMatch(/Wallet 0xdead/);
        expect(result.content[0]?.text).toMatch(/12.5 \$CPU/);
        expect(result.content[0]?.text).toMatch(/0.3 gas/);
    });
});

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';

import { TransportStatus, type TransportQuoteResponse, type TransportStatusResponse } from '../../../api/types.js';
import { NoopLogger } from '../../../logger/noop.logger.js';
import {
    type FreeTransportResult,
    type PaidTransportResult,
    type PendingTransportView,
    TransportResultKind,
} from '../../../services/types.js';
import type { AppContext } from '../../../types.js';
import { TxStatus } from '../../../wallet/types.js';
import { registerGetPendingTransportsTool } from '../get-pending/get-pending-transports.js';
import { registerGetTransportStatusTool } from '../get-status/get-transport-status.js';
import { registerListMyTransportsTool } from '../list-mine/list-my-transports.js';
import { registerQuoteTransportTool } from '../quote/quote-transport.js';
import { registerResumeTransportTool } from '../resume/resume-transport.js';
import { registerTransportTool } from '../transport.js';

interface ToolResult {
    content: Array<{ type: string; text: string }>;
}

type Register = (server: McpServer, context: AppContext) => void;

const RESOURCES = { 3: 'Silica' };

function capture(register: Register, transport: unknown): (args: never) => Promise<ToolResult> {
    const appConfig = { load: async () => ({ resources: RESOURCES }) };
    const context = { transport, appConfig, logger: new NoopLogger() } as unknown as AppContext;
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

const freeResult: FreeTransportResult = {
    kind: TransportResultKind.Free,
    jobId: 55,
    status: TransportStatus.InTransit,
    sourceTokenId: '10',
    targetTokenId: '20',
    resourceId: 3,
    amount: '100',
    totalDistance: 4,
    totalTimeSec: 4,
    startedAt: 1700,
    arrivalAt: 1704,
};

const paidResult: PaidTransportResult = {
    kind: TransportResultKind.Paid,
    jobId: 77,
    signId: 9,
    sourceTokenId: '10',
    targetTokenId: '20',
    resourceId: 3,
    amount: '100',
    totalAmount: '10000000000000000000',
    burnAmount: '1000000000000000000',
    recipients: ['0x4444444444444444444444444444444444444444'],
    payouts: ['9000000000000000000'],
    txHash: '0xtransport',
    approveTxHash: '0xapprove',
    status: TxStatus.Success,
    blockNumber: '100',
};

const statusResponse: TransportStatusResponse = {
    id: 55,
    status: TransportStatus.InTransit,
    sourceTokenId: '10',
    targetTokenId: '20',
    resourceId: 3,
    amount: '100',
    totalDistance: 4,
    totalTimeSec: 4,
    startedAt: 1700,
    arrivalAt: 1704,
    progress: {
        elapsedSec: 2,
        traveledDistance: 2,
        totalDistance: 4,
        totalTimeSec: 4,
        arrived: false,
        segmentIndex: 0,
        reachedWaypoints: 0,
        position: { x: 0.5, y: 0 },
    },
};

describe('transport tool', () => {
    it('reports a free transport', async () => {
        const handler = capture(registerTransportTool, { transport: async () => freeResult });
        const result = await handler({ path: [], resourceId: 3, amount: '100' } as never);
        expect(result.content[0]?.text).toMatch(/Free transport 55/);
        expect(result.content[0]?.text).toMatch(/Silica \(#3\)/);
        expect(result.content[0]?.text).toMatch(/get_transport_status 55/);
    });

    it('reports a paid transport with the approve and transport tx', async () => {
        const handler = capture(registerTransportTool, { transport: async () => paidResult });
        const result = await handler({ path: [], resourceId: 3, amount: '100' } as never);
        expect(result.content[0]?.text).toMatch(/Paid transport 77/);
        expect(result.content[0]?.text).toMatch(/Silica \(#3\)/);
        expect(result.content[0]?.text).toMatch(/10 \$CPU/);
        expect(result.content[0]?.text).toMatch(/approve tx 0xapprove/);
        expect(result.content[0]?.text).toMatch(/transport tx 0xtransport/);
    });

    it('propagates service errors', async () => {
        const handler = capture(registerTransportTool, {
            transport: async () => {
                throw new Error('not authenticated');
            },
        });
        await expect(handler({ path: [], resourceId: 3, amount: '100' } as never)).rejects.toThrow(/not authenticated/);
    });
});

describe('quote_transport tool', () => {
    it('summarizes a paid quote', async () => {
        const quote: TransportQuoteResponse = {
            paid: true,
            totalDistance: 4,
            totalTimeSec: 4,
            fee: {
                total: '10',
                burn: '1',
                recipients: ['0x4444444444444444444444444444444444444444'],
                payouts: ['9'],
                totalWei: '10000000000000000000',
                burnWei: '1000000000000000000',
                payoutsWei: ['9000000000000000000'],
            },
        };
        const handler = capture(registerQuoteTransportTool, { quote: async () => quote });
        const result = await handler({ path: [], resourceId: 3, amount: '100' } as never);
        expect(result.content[0]?.text).toMatch(/Paid route/);
        expect(result.content[0]?.text).toMatch(/10 \$CPU/);
    });
});

describe('get_transport_status tool', () => {
    it('reports live progress', async () => {
        const handler = capture(registerGetTransportStatusTool, { getStatus: async () => statusResponse });
        const result = await handler({ jobId: 55 } as never);
        expect(result.content[0]?.text).toMatch(/Transport 55: in_transit/);
        expect(result.content[0]?.text).toMatch(/Silica \(#3\)/);
        expect(result.content[0]?.text).toMatch(/2\.0\/4 hops/);
    });
});

describe('list_my_transports tool', () => {
    it('lists the caller jobs', async () => {
        const handler = capture(registerListMyTransportsTool, { listMine: async () => [statusResponse] });
        const result = await handler({ status: null } as never);
        expect(result.content[0]?.text).toMatch(/1 transport/);
        expect(result.content[0]?.text).toMatch(/job 55: in_transit/);
        expect(result.content[0]?.text).toMatch(/Silica \(#3\)/);
    });
});

describe('get_pending_transports tool', () => {
    it('lists resumable actions with the next step', async () => {
        const pending: PendingTransportView = {
            jobId: 77,
            signId: 9,
            sourceTokenId: '10',
            targetTokenId: '20',
            resourceId: 3,
            amount: '100',
            totalAmount: '10000000000000000000',
            deadline: '9999999999',
            resumable: true,
        };
        const handler = capture(registerGetPendingTransportsTool, { getPending: async () => [pending] });
        const result = await handler({} as never);
        expect(result.content[0]?.text).toMatch(/resume_transport 77/);
        expect(result.content[0]?.text).toMatch(/Silica \(#3\)/);
        expect(result.content[0]?.text).toMatch(/10 \$CPU/);
    });
});

describe('resume_transport tool', () => {
    it('reports the completed payment', async () => {
        const handler = capture(registerResumeTransportTool, { resume: async () => paidResult });
        const result = await handler({ jobId: 77 } as never);
        expect(result.content[0]?.text).toMatch(/Paid transport 77/);
    });
});

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { parseEther } from 'viem';
import { describe, expect, it } from 'vitest';

import { NoopLogger } from '../../../logger/noop.logger.js';
import type { WithdrawResult } from '../../../services/types.js';
import type { AppContext } from '../../../types.js';
import { TxStatus } from '../../../wallet/types.js';
import { registerWithdrawTool } from '../withdraw.js';

interface ToolResult {
    content: Array<{ type: string; text: string }>;
}

type Handler = (args: { tokenId: string; amount: string }) => Promise<ToolResult>;

function harness(outcome: WithdrawResult | Error): Handler {
    const withdraw = {
        withdraw: async (): Promise<WithdrawResult> => {
            if (outcome instanceof Error) {
                throw outcome;
            }
            return outcome;
        },
    };
    const context = { withdraw, logger: new NoopLogger() } as unknown as AppContext;

    let captured: Handler | null = null;
    const server = {
        registerTool(_name: string, _def: unknown, handler: Handler): void {
            captured = handler;
        },
    } as unknown as McpServer;

    registerWithdrawTool(server, context);
    if (captured === null) {
        throw new Error('withdraw was not registered');
    }
    return captured;
}

const result: WithdrawResult = {
    tokenId: '42',
    signId: 5,
    amount: parseEther('100').toString(),
    txHash: '0xwithdraw',
    approveTxHash: null,
    status: TxStatus.Success,
    blockNumber: '100',
    resumed: false,
};

describe('withdraw tool', () => {
    it('reports a fresh withdraw with the minted $CPU amount', async () => {
        const out = await harness(result)({ tokenId: '42', amount: '100' });
        expect(out.content[0]?.text).toMatch(/Withdrew from cell 42/);
        expect(out.content[0]?.text).toMatch(/100 \$CPU/);
        expect(out.content[0]?.text).toMatch(/0xwithdraw/);
        const parsed = JSON.parse(out.content[1]?.text ?? '{}') as WithdrawResult;
        expect(parsed.resumed).toBe(false);
    });

    it('frames a resumed withdraw differently', async () => {
        const out = await harness({ ...result, resumed: true })({ tokenId: '42', amount: '100' });
        expect(out.content[0]?.text).toMatch(/Finished the pending withdraw from cell 42/);
    });

    it('propagates service errors', async () => {
        await expect(harness(new Error('not authenticated'))({ tokenId: '42', amount: '100' })).rejects.toThrow(
            /not authenticated/,
        );
    });
});

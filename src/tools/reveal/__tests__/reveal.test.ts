import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';

import { NoopLogger } from '../../../logger/noop.logger.js';
import type { RevealResult } from '../../../services/types.js';
import type { AppContext } from '../../../types.js';
import { TxStatus } from '../../../wallet/types.js';
import { registerRevealTool } from '../reveal.js';

interface ToolResult {
    content: Array<{ type: string; text: string }>;
}

type Handler = (args: { tokenId: string }) => Promise<ToolResult>;

function harness(outcome: RevealResult | Error): Handler {
    const reveal = {
        reveal: async (): Promise<RevealResult> => {
            if (outcome instanceof Error) {
                throw outcome;
            }
            return outcome;
        },
    };
    const context = { reveal, logger: new NoopLogger() } as unknown as AppContext;

    let captured: Handler | null = null;
    const server = {
        registerTool(_name: string, _def: unknown, handler: Handler): void {
            captured = handler;
        },
    } as unknown as McpServer;

    registerRevealTool(server, context);
    if (captured === null) {
        throw new Error('reveal was not registered');
    }
    return captured;
}

const freeResult: RevealResult = {
    tokenId: '42',
    signId: 5,
    txHash: '0xreveal',
    approveTxHash: null,
    status: TxStatus.Success,
    cpuAmount: '0',
    blockNumber: '100',
};

describe('reveal tool', () => {
    it('reports the reveal tx for a free reveal', async () => {
        const result = await harness(freeResult)({ tokenId: '42' });
        expect(result.content[0]?.text).toMatch(/0xreveal/);
        expect(result.content[0]?.text).not.toMatch(/approve/i);
        const parsed = JSON.parse(result.content[1]?.text ?? '{}') as RevealResult;
        expect(parsed.txHash).toBe('0xreveal');
        expect(parsed.approveTxHash).toBeNull();
    });

    it('reports both the approve and reveal tx for a paid re-reveal', async () => {
        const result = await harness({ ...freeResult, approveTxHash: '0xapprove', cpuAmount: '1000' })({
            tokenId: '42',
        });
        expect(result.content[0]?.text).toMatch(/approve tx 0xapprove/);
        expect(result.content[0]?.text).toMatch(/1000 \$CPU/);
    });

    it('propagates service errors', async () => {
        await expect(harness(new Error('not authenticated'))({ tokenId: '42' })).rejects.toThrow(/not authenticated/);
    });
});

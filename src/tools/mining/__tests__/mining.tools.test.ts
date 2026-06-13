import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';

import type { ClaimResponse, MiningStatusResponse } from '../../../api/types.js';
import { NoopLogger } from '../../../logger/noop.logger.js';
import type { AppContext } from '../../../types.js';
import { registerClaimMiningTool } from '../claim/claim-mining.js';
import { registerGetMiningStatusTool } from '../get-status/get-mining-status.js';

interface ToolResult {
    content: Array<{ type: string; text: string }>;
}

type Handler = (args: { tokenId: string }) => Promise<ToolResult>;

const appConfigStub = {
    load: async (): Promise<{ resources: Record<number, string> }> => ({ resources: { 3: 'Silica' } }),
};

function capture(register: (server: McpServer, context: AppContext) => void, context: AppContext): Handler {
    let captured: Handler | null = null;
    const server = {
        registerTool(_name: string, _def: unknown, handler: Handler): void {
            captured = handler;
        },
    } as unknown as McpServer;
    register(server, context);
    if (captured === null) {
        throw new Error('tool was not registered');
    }
    return captured;
}

function statusHarness(outcome: MiningStatusResponse | Error): Handler {
    const mining = {
        getStatus: async (): Promise<MiningStatusResponse> => {
            if (outcome instanceof Error) {
                throw outcome;
            }
            return outcome;
        },
    };
    const context = { mining, appConfig: appConfigStub, logger: new NoopLogger() } as unknown as AppContext;
    return capture(registerGetMiningStatusTool, context);
}

function claimHarness(outcome: ClaimResponse | Error): Handler {
    const mining = {
        claim: async (): Promise<ClaimResponse> => {
            if (outcome instanceof Error) {
                throw outcome;
            }
            return outcome;
        },
    };
    const context = { mining, appConfig: appConfigStub, logger: new NoopLogger() } as unknown as AppContext;
    return capture(registerClaimMiningTool, context);
}

describe('get_mining_status tool', () => {
    it('summarizes an active extractor with the resource name', async () => {
        const result = await statusHarness({
            tokenId: '42',
            active: true,
            targetResourceId: 3,
            tier: 1,
            startAt: 1700,
            minedAmount: 120,
            depositRemaining: 500,
        })({ tokenId: '42' });

        const header = result.content[0]?.text ?? '';
        expect(header).toMatch(/Silica \(#3\)/);
        expect(header).toMatch(/120 unclaimed/);
        expect(header).toMatch(/500 left/);

        const parsed = JSON.parse(result.content[1]?.text ?? '{}') as MiningStatusResponse;
        expect(parsed.targetResourceId).toBe(3);
    });

    it('reports an inactive cell', async () => {
        const result = await statusHarness({
            tokenId: '42',
            active: false,
            targetResourceId: null,
            tier: null,
            startAt: null,
            minedAmount: 0,
            depositRemaining: 0,
        })({ tokenId: '42' });

        expect(result.content[0]?.text).toMatch(/no active mining/i);
    });
});

describe('claim_mining tool', () => {
    it('reports the claimed amount and new balance', async () => {
        const result = await claimHarness({
            tokenId: '42',
            resourceId: 3,
            claimedAmount: 120,
            balanceAmount: 620,
            depositRemaining: 380,
            depleted: false,
        })({ tokenId: '42' });

        const header = result.content[0]?.text ?? '';
        expect(header).toMatch(/Claimed 120 Silica \(#3\)/);
        expect(header).toMatch(/balance now 620/);
        expect(header).toMatch(/380 left/);
    });

    it('reports a no-op claim when nothing has accrued', async () => {
        const result = await claimHarness({
            tokenId: '42',
            resourceId: 3,
            claimedAmount: 0,
            balanceAmount: 0,
            depositRemaining: 0,
            depleted: true,
        })({ tokenId: '42' });

        expect(result.content[0]?.text).toMatch(/nothing to claim/i);
    });

    it('propagates service errors', async () => {
        await expect(claimHarness(new Error('NotCellOwner'))({ tokenId: '42' })).rejects.toThrow(/NotCellOwner/);
    });
});

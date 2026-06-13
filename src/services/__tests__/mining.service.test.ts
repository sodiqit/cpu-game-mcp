import { describe, expect, it } from 'vitest';

import type { ApiClient } from '../../api/client.js';
import type { ClaimResponse, MiningStatusResponse } from '../../api/types.js';
import { NoopLogger } from '../../logger/noop.logger.js';
import { MiningService } from '../mining.service.js';

const STATUS: MiningStatusResponse = {
    tokenId: '42',
    active: true,
    targetResourceId: 3,
    tier: 1,
    startAt: 1700,
    minedAmount: 120,
    depositRemaining: 500,
};

const CLAIM: ClaimResponse = {
    tokenId: '42',
    resourceId: 3,
    claimedAmount: 120,
    balanceAmount: 620,
    depositRemaining: 380,
    depleted: false,
};

class FakeApi {
    public readonly requestCalls: Array<string> = [];
    public readonly authCalls: Array<{ path: string; method: string | null }> = [];
    constructor(
        private readonly getResponse: { status: number; data: unknown },
        private readonly claimResponse: { status: number; data: unknown },
    ) {}
    async request(path: string): Promise<{ status: number; data: unknown }> {
        this.requestCalls.push(path);
        return this.getResponse;
    }
    async authenticatedRequest(
        path: string,
        options: { method: string } | null = null,
    ): Promise<{ status: number; data: unknown }> {
        this.authCalls.push({ path, method: options?.method ?? null });
        return this.claimResponse;
    }
}

function makeService(
    getResponse: { status: number; data: unknown } = { status: 200, data: STATUS },
    claimResponse: { status: number; data: unknown } = { status: 200, data: CLAIM },
): { service: MiningService; api: FakeApi } {
    const api = new FakeApi(getResponse, claimResponse);
    const service = new MiningService({ api: api as unknown as ApiClient, logger: new NoopLogger() });
    return { service, api };
}

describe('MiningService', () => {
    it('reads status via an unauthenticated GET', async () => {
        const { service, api } = makeService();

        const result = await service.getStatus('42');

        expect(api.requestCalls).toEqual(['/api/v1/mining/42']);
        expect(api.authCalls).toHaveLength(0);
        expect(result).toEqual(STATUS);
    });

    it('throws when the status read fails', async () => {
        const { service } = makeService({ status: 404, data: { message: 'CellNotFound' } });
        await expect(service.getStatus('42')).rejects.toThrow(/CellNotFound/);
    });

    it('claims via an authenticated POST', async () => {
        const { service, api } = makeService();

        const result = await service.claim('42');

        expect(api.authCalls).toEqual([{ path: '/api/v1/mining/42/claim', method: 'POST' }]);
        expect(result).toEqual(CLAIM);
    });

    it('throws when the claim fails', async () => {
        const { service } = makeService(undefined, { status: 409, data: { message: 'NotCellOwner' } });
        await expect(service.claim('42')).rejects.toThrow(/NotCellOwner/);
    });
});

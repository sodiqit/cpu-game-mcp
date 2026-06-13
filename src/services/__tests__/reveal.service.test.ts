import { decodeFunctionData } from 'viem';
import { describe, expect, it } from 'vitest';

import type { RevealSignatureResponse } from '../../api/types.js';
import { GAME_SETTLEMENT_ABI } from '../../contracts/game-settlement.abi.js';
import { TxStatus } from '../../wallet/types.js';
import { RevealService } from '../reveal.service.js';
import {
    APPROVE_HASH,
    CPU_TOKEN,
    GAME_SETTLEMENT,
    type Harness,
    type HarnessOptions,
    makeConfig,
    makeHarness,
    R,
    S,
} from './service-fakes.js';

function makeSig(overrides: Partial<RevealSignatureResponse> = {}): RevealSignatureResponse {
    return { signId: 5, tokenId: '42', cpuAmount: '0', deadline: '1700', v: 27, r: R, s: S, ...overrides };
}

function makeService(opts: HarnessOptions): Harness<RevealService> {
    return makeHarness((deps) => new RevealService(deps), opts);
}

describe('RevealService', () => {
    it('encodes and submits a free reveal, returns the confirmed tx', async () => {
        const { service, api, wallet, allowance } = makeService({ response: { status: 200, data: makeSig() } });

        const result = await service.reveal('42');

        expect(api.calls[0]?.path).toBe('/api/v1/reveal');
        expect(api.calls[0]?.body).toEqual({ tokenId: '42', network: 'ethereum' });
        expect(allowance.calls).toHaveLength(0); // free reveal never touches $CPU

        expect(wallet.sent).toHaveLength(1);
        const sent = wallet.sent[0];
        if (sent === undefined) {
            throw new Error('expected one tx');
        }
        expect(sent.to).toBe(GAME_SETTLEMENT);
        const decoded = decodeFunctionData({ abi: GAME_SETTLEMENT_ABI, data: sent.data });
        expect(decoded.functionName).toBe('reveal');
        expect(decoded.args).toEqual([5n, 42n, 0n, 1700n, 27, R, S]);

        expect(result.approveTxHash).toBeNull();
        expect(result.status).toBe(TxStatus.Success);
        expect(result.txHash).toBe(`0x${'1'.padStart(64, '0')}`);
        expect(result.blockNumber).toBe('100');
    });

    it('ensures the $CPU allowance before a paid re-reveal, then reveals', async () => {
        const { service, wallet, allowance } = makeService({
            response: { status: 200, data: makeSig({ cpuAmount: '1000' }) },
            approve: APPROVE_HASH,
        });

        const result = await service.reveal('42');

        // Approve is delegated to the allowance service with the right token/spender/amount.
        expect(allowance.calls).toEqual([{ token: CPU_TOKEN, spender: GAME_SETTLEMENT, needed: 1000n }]);
        // Only the reveal tx flows through the wallet here.
        expect(wallet.sent).toHaveLength(1);
        const sent = wallet.sent[0];
        if (sent === undefined) {
            throw new Error('expected one tx');
        }
        expect(sent.to).toBe(GAME_SETTLEMENT);
        const reveal = decodeFunctionData({ abi: GAME_SETTLEMENT_ABI, data: sent.data });
        expect(reveal.functionName).toBe('reveal');
        expect(reveal.args).toEqual([5n, 42n, 1000n, 1700n, 27, R, S]);

        expect(result.approveTxHash).toBe(APPROVE_HASH);
    });

    it('reports no approve tx when the allowance already covered the cost', async () => {
        const { service, allowance } = makeService({
            response: { status: 200, data: makeSig({ cpuAmount: '1000' }) },
            approve: null,
        });

        const result = await service.reveal('42');

        expect(allowance.calls).toHaveLength(1);
        expect(result.approveTxHash).toBeNull();
    });

    it('throws before touching the wallet when $CPU is not configured for a paid re-reveal', async () => {
        const { service, wallet, allowance } = makeService({
            response: { status: 200, data: makeSig({ cpuAmount: '1000' }) },
            config: makeConfig(''),
        });
        await expect(service.reveal('42')).rejects.toThrow(/not configured/i);
        expect(allowance.calls).toHaveLength(0);
        expect(wallet.sent).toHaveLength(0);
    });

    it('propagates an approve failure and does not reveal', async () => {
        const { service, wallet } = makeService({
            response: { status: 200, data: makeSig({ cpuAmount: '1000' }) },
            approve: new Error('Approve transaction reverted on-chain (tx 0xabc).'),
        });
        await expect(service.reveal('42')).rejects.toThrow(/approve transaction reverted/i);
        expect(wallet.sent).toHaveLength(0);
    });

    it('throws when the reveal tx reverts on-chain', async () => {
        const { service } = makeService({ response: { status: 200, data: makeSig() }, receipts: [TxStatus.Reverted] });
        await expect(service.reveal('42')).rejects.toThrow(/reverted/i);
    });

    it('surfaces an API error and sends no transaction', async () => {
        const { service, wallet, allowance } = makeService({
            response: { status: 403, data: { message: 'NotCellOwner' } },
        });
        await expect(service.reveal('42')).rejects.toThrow(/NotCellOwner/);
        expect(wallet.sent).toHaveLength(0);
        expect(allowance.calls).toHaveLength(0);
    });

    it('refuses when the wallet chainId does not match the chain config', async () => {
        const { service, api, wallet } = makeService({
            response: { status: 200, data: makeSig() },
            walletChainId: 8453,
        });
        await expect(service.reveal('42')).rejects.toThrow(/chain mismatch/i);
        expect(api.calls).toHaveLength(0);
        expect(wallet.sent).toHaveLength(0);
    });
});

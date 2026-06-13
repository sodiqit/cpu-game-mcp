import { decodeFunctionData } from 'viem';
import { describe, expect, it } from 'vitest';

import {
    type PaidTransportSignatureResponse,
    type TransportJobResponse,
    type TransportQuoteResponse,
    TransportStatus,
    type TransportStatusResponse,
} from '../../api/types.js';
import { GAME_SETTLEMENT_ABI } from '../../contracts/game-settlement.abi.js';
import { TxStatus } from '../../wallet/types.js';
import { TransportService } from '../transport.service.js';
import { TransportResultKind } from '../types.js';
import {
    APPROVE_HASH,
    CPU_TOKEN,
    GAME_SETTLEMENT,
    type Harness,
    type HarnessOptions,
    makeHarness,
    R,
    S,
    WALLET_ADDRESS,
} from './service-fakes.js';

const HUB = '0x4444444444444444444444444444444444444444';

const INPUT = {
    path: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
    ],
    resourceId: 3,
    amount: '100',
};

function makeFreeJob(overrides: Partial<TransportJobResponse> = {}): TransportJobResponse {
    return {
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
        ...overrides,
    };
}

function makePaidAction(overrides: Partial<PaidTransportSignatureResponse> = {}): PaidTransportSignatureResponse {
    return {
        jobId: 77,
        signId: 9,
        status: TransportStatus.AwaitingPayment,
        sender: WALLET_ADDRESS,
        sourceTokenId: '10',
        targetTokenId: '20',
        resourceId: 3,
        amount: '100',
        totalAmount: '1000',
        burnAmount: '100',
        recipients: [HUB],
        payouts: ['900'],
        deadline: '9999999999',
        v: 27,
        r: R,
        s: S,
        ...overrides,
    };
}

function makeService(opts: HarnessOptions): Harness<TransportService> {
    return makeHarness((deps) => new TransportService(deps), opts);
}

describe('TransportService.transport', () => {
    it('returns a free job without touching the wallet or $CPU', async () => {
        const { service, api, wallet, allowance } = makeService({ response: { status: 200, data: makeFreeJob() } });

        const result = await service.transport(INPUT);

        expect(api.calls[0]?.path).toBe('/api/v1/transport');
        expect(api.calls[0]?.method).toBe('POST');
        expect(api.calls[0]?.body).toEqual({ ...INPUT, network: 'ethereum' });
        expect(result.kind).toBe(TransportResultKind.Free);
        expect(result.jobId).toBe(55);
        expect(wallet.sent).toHaveLength(0);
        expect(allowance.calls).toHaveLength(0);
    });

    it('approves $CPU and submits the on-chain payment for a paid route', async () => {
        const { service, wallet, allowance } = makeService({
            response: { status: 200, data: makePaidAction() },
            approve: APPROVE_HASH,
        });

        const result = await service.transport(INPUT);

        expect(allowance.calls).toEqual([{ token: CPU_TOKEN, spender: GAME_SETTLEMENT, needed: 1000n }]);
        expect(wallet.sent).toHaveLength(1);
        const sent = wallet.sent[0];
        if (sent === undefined) {
            throw new Error('expected one tx');
        }
        expect(sent.to).toBe(GAME_SETTLEMENT);
        const decoded = decodeFunctionData({ abi: GAME_SETTLEMENT_ABI, data: sent.data });
        expect(decoded.functionName).toBe('transport');
        expect(decoded.args).toEqual([9n, 10n, 1000n, 100n, [HUB], [900n], 9999999999n, 27, R, S]);

        if (result.kind !== TransportResultKind.Paid) {
            throw new Error('expected a paid result');
        }
        expect(result.approveTxHash).toBe(APPROVE_HASH);
        expect(result.totalAmount).toBe('1000');
        expect(result.txHash).toBe(`0x${'1'.padStart(64, '0')}`);
    });

    it('refuses when the signature sender does not match the wallet — no tx', async () => {
        const { service, wallet, allowance } = makeService({
            response: { status: 200, data: makePaidAction({ sender: '0x9999999999999999999999999999999999999999' }) },
        });
        await expect(service.transport(INPUT)).rejects.toThrow(/issued for/i);
        expect(wallet.sent).toHaveLength(0);
        expect(allowance.calls).toHaveLength(0);
    });

    it('wraps a failed on-chain payment with the resume hint and jobId', async () => {
        const { service } = makeService({
            response: { status: 200, data: makePaidAction() },
            receipts: [TxStatus.Reverted],
        });
        await expect(service.transport(INPUT)).rejects.toThrow(/resume_transport 77/);
    });

    it('wraps an approve failure with the resume hint', async () => {
        const { service, wallet } = makeService({
            response: { status: 200, data: makePaidAction() },
            approve: new Error('Approve transaction reverted on-chain (tx 0xabc).'),
        });
        await expect(service.transport(INPUT)).rejects.toThrow(/resume_transport 77/);
        expect(wallet.sent).toHaveLength(0);
    });

    it('surfaces a 409 pending-action conflict and sends no tx', async () => {
        const { service, wallet } = makeService({
            response: { status: 409, data: { message: 'PendingTransportActionExists' } },
        });
        await expect(service.transport(INPUT)).rejects.toThrow(/PendingTransportActionExists/);
        expect(wallet.sent).toHaveLength(0);
    });

    it('refuses on a chain mismatch before calling the API', async () => {
        const { service, api, wallet } = makeService({
            response: { status: 200, data: makeFreeJob() },
            walletChainId: 8453,
        });
        await expect(service.transport(INPUT)).rejects.toThrow(/chain mismatch/i);
        expect(api.calls).toHaveLength(0);
        expect(wallet.sent).toHaveLength(0);
    });
});

describe('TransportService.quote', () => {
    const quote: TransportQuoteResponse = {
        paid: true,
        totalDistance: 4,
        totalTimeSec: 4,
        fee: {
            total: '10',
            burn: '1',
            recipients: [HUB],
            payouts: ['9'],
            totalWei: '10000000000000000000',
            burnWei: '1000000000000000000',
            payoutsWei: ['9000000000000000000'],
        },
    };

    it('previews a route without any transaction', async () => {
        const { service, api, wallet } = makeService({ response: { status: 200, data: quote } });

        const result = await service.quote(INPUT);

        expect(api.calls[0]?.path).toBe('/api/v1/transport/quote');
        expect(api.calls[0]?.method).toBe('POST');
        expect(result.paid).toBe(true);
        expect(result.fee.totalWei).toBe('10000000000000000000');
        expect(wallet.sent).toHaveLength(0);
    });

    it('surfaces a route rejection', async () => {
        const { service } = makeService({ response: { status: 400, data: { message: 'INTERMEDIATE_NOT_ELIGIBLE' } } });
        await expect(service.quote(INPUT)).rejects.toThrow(/INTERMEDIATE_NOT_ELIGIBLE/);
    });
});

describe('TransportService.resume', () => {
    it('re-pays a still-valid pending action by jobId', async () => {
        const { service, api, wallet, allowance } = makeService({
            response: { status: 200, data: [makePaidAction()] },
        });

        const result = await service.resume(77);

        expect(api.calls[0]?.path).toBe('/api/v1/transport/pending');
        expect(wallet.reads[0]?.functionName).toBe('usedSignIds');
        expect(allowance.calls).toHaveLength(1);
        expect(wallet.sent).toHaveLength(1);
        expect(result.jobId).toBe(77);
    });

    it('throws when no pending action matches the jobId', async () => {
        const { service } = makeService({ response: { status: 200, data: [] } });
        await expect(service.resume(77)).rejects.toThrow(/No pending/i);
    });

    it('refuses an expired signature without a tx', async () => {
        const { service, wallet } = makeService({
            response: { status: 200, data: [makePaidAction({ deadline: '1' })] },
        });
        await expect(service.resume(77)).rejects.toThrow(/expired/i);
        expect(wallet.sent).toHaveLength(0);
    });

    it('reports an already-paid action and sends no tx', async () => {
        const { service, wallet } = makeService({
            response: { status: 200, data: [makePaidAction()] },
            usedSignId: true,
        });
        await expect(service.resume(77)).rejects.toThrow(/already paid/i);
        expect(wallet.sent).toHaveLength(0);
    });
});

describe('TransportService reads', () => {
    it('getPending annotates resumable from the deadline', async () => {
        const { service } = makeService({
            response: {
                status: 200,
                data: [makePaidAction(), makePaidAction({ jobId: 78, deadline: '1' })],
            },
        });

        const pending = await service.getPending();

        expect(pending[0]?.resumable).toBe(true);
        expect(pending[1]?.resumable).toBe(false);
    });

    it('listMine passes the status filter through', async () => {
        const job: TransportStatusResponse = {
            ...makeFreeJob(),
            progress: {
                elapsedSec: 1,
                traveledDistance: 1,
                totalDistance: 4,
                totalTimeSec: 4,
                arrived: false,
                segmentIndex: 0,
                reachedWaypoints: 0,
                position: { x: 0.5, y: 0 },
            },
        };
        const { service, api } = makeService({ response: { status: 200, data: [job] } });

        const result = await service.listMine(TransportStatus.InTransit);

        expect(api.calls[0]?.path).toBe('/api/v1/transport/mine?status=in_transit');
        expect(api.calls[0]?.authenticated).toBe(true);
        expect(result).toHaveLength(1);
    });

    it('getStatus reads the public endpoint (no auth)', async () => {
        const job: TransportStatusResponse = {
            ...makeFreeJob({ id: 55 }),
            progress: {
                elapsedSec: 4,
                traveledDistance: 4,
                totalDistance: 4,
                totalTimeSec: 4,
                arrived: true,
                segmentIndex: 1,
                reachedWaypoints: 1,
                position: { x: 1, y: 0 },
            },
        };
        const { service, api } = makeService({ response: { status: 200, data: job } });

        const result = await service.getStatus(55);

        expect(api.calls[0]?.path).toBe('/api/v1/transport/55');
        expect(api.calls[0]?.authenticated).toBe(false);
        expect(result.progress.arrived).toBe(true);
    });
});

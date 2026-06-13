import { describeApiError } from './reveal.helpers.js';
import type { MiningServiceOptions } from './types.js';
import type { ApiClient } from '../api/client.js';
import { type ClaimResponse, HttpStatus, type MiningStatusResponse } from '../api/types.js';
import type { ILogger } from '../logger/types.js';

/**
 * Mining is fully off-chain: an extractor accrues its target resource lazily and the owner banks it.
 * Status is a public read; claim is an owner-only POST. Neither path touches the wallet or the chain.
 */
export class MiningService {
    private readonly api: ApiClient;
    private readonly logger: ILogger;

    constructor(options: MiningServiceOptions) {
        this.api = options.api;
        this.logger = options.logger;
    }

    /** Public read — lazily-computed accrual for any cell (no auth, works for any tokenId). */
    async getStatus(tokenId: string): Promise<MiningStatusResponse> {
        const response = await this.api.request<MiningStatusResponse>(`/api/v1/mining/${tokenId}`);
        if (response.status !== HttpStatus.Ok) {
            throw new Error(
                `Failed to get mining status for cell ${tokenId} (HTTP ${response.status}): ${describeApiError(response.data)}`,
            );
        }
        return response.data;
    }

    /** Owner-only off-chain claim — banks accrued units into the cell's balance and resets the cursor. */
    async claim(tokenId: string): Promise<ClaimResponse> {
        this.logger.info('claiming mined resources', { tokenId });
        const response = await this.api.authenticatedRequest<ClaimResponse>(`/api/v1/mining/${tokenId}/claim`, {
            method: 'POST',
            body: null,
        });
        if (response.status !== HttpStatus.Ok) {
            throw new Error(
                `Mining claim failed for cell ${tokenId} (HTTP ${response.status}): ${describeApiError(response.data)}`,
            );
        }
        return response.data;
    }
}

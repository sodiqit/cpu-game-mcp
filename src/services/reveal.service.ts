import { isAddress, type Address } from 'viem';

import { describeApiError } from './reveal.helpers.js';
import { settleSpend } from './settlement.helpers.js';
import type { IAllowanceService, IAppConfig, RevealResult, RevealServiceOptions } from './types.js';
import type { ApiClient } from '../api/client.js';
import { HttpStatus, type RevealRequest, type RevealSignatureResponse } from '../api/types.js';
import type { ILogger } from '../logger/types.js';
import type { WalletProvider } from '../wallet/types.js';

export class RevealService {
    private readonly api: ApiClient;
    private readonly wallet: WalletProvider;
    private readonly appConfig: IAppConfig;
    private readonly allowance: IAllowanceService;
    private readonly logger: ILogger;

    constructor(options: RevealServiceOptions) {
        this.api = options.api;
        this.wallet = options.wallet;
        this.appConfig = options.appConfig;
        this.allowance = options.allowance;
        this.logger = options.logger;
    }

    async reveal(tokenId: string): Promise<RevealResult> {
        const config = await this.appConfig.load();
        const wallet = this.wallet.get();

        if (config.chainId !== wallet.getChainId()) {
            throw new Error(
                `Chain mismatch: the chain config is chainId ${config.chainId} but the wallet is on ${wallet.getChainId()}. Check NETWORK.`,
            );
        }

        const gameSettlement = config.contracts.gameSettlement;

        this.logger.info('requesting reveal signature', { tokenId, network: config.network });
        const response = await this.api.authenticatedRequest<RevealSignatureResponse>('/api/v1/reveal', {
            method: 'POST',
            body: { tokenId, network: config.network } satisfies RevealRequest,
        });

        if (response.status !== HttpStatus.Ok) {
            throw new Error(`Reveal request failed (HTTP ${response.status}): ${describeApiError(response.data)}`);
        }

        const sig = response.data;

        // The first reveal is free; a re-reveal costs $CPU and needs a configured token to approve.
        let cpuToken: Address | null = null;
        if (BigInt(sig.cpuAmount) > 0n) {
            const token = config.contracts.cpuToken;
            if (!isAddress(token, { strict: false })) {
                throw new Error(
                    `$CPU token is not configured for network ${config.network}; cannot pay for re-reveal.`,
                );
            }
            cpuToken = token;
        }

        this.logger.info('submitting reveal tx', { tokenId, gameSettlement, cpuAmount: sig.cpuAmount });
        const settlement = await settleSpend({
            wallet,
            allowance: this.allowance,
            gameSettlement,
            cpuToken,
            functionName: 'reveal',
            sig,
            revertLabel: 'Reveal transaction',
        });

        this.logger.info('reveal confirmed', { tokenId, txHash: settlement.txHash, block: settlement.blockNumber });
        return {
            tokenId,
            signId: sig.signId,
            cpuAmount: sig.cpuAmount,
            ...settlement,
        };
    }
}

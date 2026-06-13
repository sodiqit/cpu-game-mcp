import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { AppContext } from '../../../types.js';
import { resourceLabel } from '../../../utils/format.utils.js';
import { claimMiningInputSchema } from '../types.js';
import { CLAIM_MINING_DESCRIPTION } from './constants.js';

export function registerClaimMiningTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'claim_mining',
        { description: CLAIM_MINING_DESCRIPTION, inputSchema: claimMiningInputSchema },
        async (args) => {
            const result = await context.mining.claim(args.tokenId);
            const { resources } = await context.appConfig.load();

            const depleted = result.depleted ? ' Deposit depleted.' : '';
            const header =
                result.claimedAmount > 0
                    ? `Claimed ${result.claimedAmount} ${resourceLabel(resources, result.resourceId)} from cell ` +
                      `${result.tokenId}. Cell balance now ${result.balanceAmount}; ${result.depositRemaining} left ` +
                      `in deposit.${depleted}`
                    : `Nothing to claim on cell ${result.tokenId} yet (${result.depositRemaining} left in deposit).`;

            return {
                content: [
                    { type: 'text', text: header },
                    { type: 'text', text: JSON.stringify(result) },
                ],
            };
        },
    );
}

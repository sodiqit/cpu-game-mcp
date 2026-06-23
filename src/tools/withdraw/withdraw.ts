import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { WITHDRAW_DESCRIPTION } from './constants.js';
import { withdrawInputSchema } from './types.js';
import type { AppContext } from '../../types.js';
import { cpuFromWei } from '../../utils/format.utils.js';

export function registerWithdrawTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'withdraw',
        { description: WITHDRAW_DESCRIPTION, inputSchema: withdrawInputSchema },
        async (args) => {
            const result = await context.withdraw.withdraw({ tokenId: args.tokenId, amount: args.amount });

            const verb = result.resumed ? 'Finished the pending withdraw from' : 'Withdrew from';
            const header =
                `${verb} cell ${result.tokenId}: minted ${cpuFromWei(result.amount)} $CPU to your wallet — withdraw tx ` +
                `${result.txHash} confirmed in block ${result.blockNumber}. Check it with get_balance.`;

            return {
                content: [
                    { type: 'text', text: header },
                    { type: 'text', text: JSON.stringify(result) },
                ],
            };
        },
    );
}

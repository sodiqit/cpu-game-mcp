import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { REVEAL_DESCRIPTION } from './constants.js';
import { revealInputSchema } from './types.js';
import type { AppContext } from '../../types.js';

export function registerRevealTool(server: McpServer, context: AppContext): void {
    server.registerTool('reveal', { description: REVEAL_DESCRIPTION, inputSchema: revealInputSchema }, async (args) => {
        const result = await context.reveal.reveal(args.tokenId);

        const confirmation = `reveal tx ${result.txHash} confirmed in block ${result.blockNumber}`;
        const header =
            result.approveTxHash !== null
                ? `Revealed cell ${result.tokenId} (paid ${result.cpuAmount} $CPU): approve tx ${result.approveTxHash}, ${confirmation}.`
                : `Revealed cell ${result.tokenId}: ${confirmation}.`;

        return {
            content: [
                {
                    type: 'text',
                    text: `${header} Resources settle shortly — use get_cell ${result.tokenId} to view them.`,
                },
                { type: 'text', text: JSON.stringify(result) },
            ],
        };
    });
}

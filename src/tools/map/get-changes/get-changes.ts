import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { AppContext } from '../../../types.js';
import { labelCell } from '../label.utils.js';
import { getWalletAddress } from '../wallet.utils.js';
import { GET_CHANGES_DESCRIPTION } from './constants.js';
import { getChangesInputSchema } from './types.js';

export function registerGetChangesTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'get_changes',
        { description: GET_CHANGES_DESCRIPTION, inputSchema: getChangesInputSchema },
        async (args) => {
            const since = args.sinceVersion ?? 0;
            const changes = context.mapReader.getChanges(since, getWalletAddress(context));
            const { resources } = await context.appConfig.load();

            const header = `Changes since v${since}: ${changes.changedCount} cells · now v${changes.version}`;

            const labeled = { ...changes, changed: changes.changed.map((cell) => labelCell(cell, resources)) };

            return {
                content: [
                    { type: 'text', text: header },
                    { type: 'text', text: JSON.stringify(labeled) },
                ],
            };
        },
    );
}

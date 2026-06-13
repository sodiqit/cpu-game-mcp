import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { GET_CRAFT_STATUS_DESCRIPTION } from './constants.js';
import type { AppContext } from '../../../types.js';
import { summarizeCraftStatus } from '../format.utils.js';
import { craftCellInputSchema } from '../types.js';

export function registerGetCraftStatusTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'get_craft_status',
        { description: GET_CRAFT_STATUS_DESCRIPTION, inputSchema: craftCellInputSchema },
        async (args) => {
            const processes = await context.craft.getStatus(args.tokenId);
            const { resources } = await context.appConfig.load();

            return {
                content: [
                    { type: 'text', text: summarizeCraftStatus(processes, resources) },
                    { type: 'text', text: JSON.stringify(processes) },
                ],
            };
        },
    );
}

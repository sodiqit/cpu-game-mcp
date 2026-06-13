import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { CRAFT_DESCRIPTION } from './constants.js';
import { summarizeFreeCraft, summarizePaidCraft } from './format.utils.js';
import { craftInputSchema } from './types.js';
import { CraftResultKind } from '../../services/types.js';
import type { AppContext } from '../../types.js';

export function registerCraftTool(server: McpServer, context: AppContext): void {
    server.registerTool('craft', { description: CRAFT_DESCRIPTION, inputSchema: craftInputSchema }, async (args) => {
        const result = await context.craft.craft({
            tokenId: args.tokenId,
            recipeId: args.recipeId,
            batches: args.batches,
        });
        const { resources } = await context.appConfig.load();

        const header =
            result.kind === CraftResultKind.Paid
                ? summarizePaidCraft(result, resources)
                : summarizeFreeCraft(result, resources);

        return {
            content: [
                { type: 'text', text: header },
                { type: 'text', text: JSON.stringify(result) },
            ],
        };
    });
}

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { TRANSPORT_DESCRIPTION } from './constants.js';
import { summarizeFree, summarizePaid } from './format.utils.js';
import { transportInputSchema } from './types.js';
import { TransportResultKind } from '../../services/types.js';
import type { AppContext } from '../../types.js';

export function registerTransportTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'transport',
        { description: TRANSPORT_DESCRIPTION, inputSchema: transportInputSchema },
        async (args) => {
            const result = await context.transport.transport({
                path: args.path,
                resourceId: args.resourceId,
                amount: args.amount,
            });

            const { resources } = await context.appConfig.load();
            const header =
                result.kind === TransportResultKind.Paid
                    ? summarizePaid(result, resources)
                    : summarizeFree(result, resources);

            return {
                content: [
                    { type: 'text', text: header },
                    { type: 'text', text: JSON.stringify(result) },
                ],
            };
        },
    );
}

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { AppContext } from '../../../types.js';
import { summarizePending } from '../format.utils.js';
import { GET_PENDING_TRANSPORTS_DESCRIPTION } from './constants.js';

export function registerGetPendingTransportsTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'get_pending_transports',
        { description: GET_PENDING_TRANSPORTS_DESCRIPTION, inputSchema: {} },
        async () => {
            const pending = await context.transport.getPending();
            const { resources } = await context.appConfig.load();

            return {
                content: [
                    { type: 'text', text: summarizePending(pending, resources) },
                    { type: 'text', text: JSON.stringify(pending) },
                ],
            };
        },
    );
}

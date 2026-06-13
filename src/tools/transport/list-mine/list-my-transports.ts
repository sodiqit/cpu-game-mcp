import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { AppContext } from '../../../types.js';
import { summarizeMine } from '../format.utils.js';
import { listMyTransportsInputSchema } from '../types.js';
import { LIST_MY_TRANSPORTS_DESCRIPTION } from './constants.js';

export function registerListMyTransportsTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'list_my_transports',
        { description: LIST_MY_TRANSPORTS_DESCRIPTION, inputSchema: listMyTransportsInputSchema },
        async (args) => {
            const jobs = await context.transport.listMine(args.status);
            const { resources } = await context.appConfig.load();
            const header = `${jobs.length} transport(s)${args.status !== null ? ` · status=${args.status}` : ''}`;

            return {
                content: [
                    { type: 'text', text: `${header}\n${summarizeMine(jobs, resources)}` },
                    { type: 'text', text: JSON.stringify(jobs) },
                ],
            };
        },
    );
}

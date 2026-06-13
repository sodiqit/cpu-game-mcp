import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { AppContext } from '../../../types.js';
import { summarizePaid } from '../format.utils.js';
import { resumeTransportInputSchema } from '../types.js';
import { RESUME_TRANSPORT_DESCRIPTION } from './constants.js';

export function registerResumeTransportTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'resume_transport',
        { description: RESUME_TRANSPORT_DESCRIPTION, inputSchema: resumeTransportInputSchema },
        async (args) => {
            const result = await context.transport.resume(args.jobId);
            const { resources } = await context.appConfig.load();

            return {
                content: [
                    { type: 'text', text: summarizePaid(result, resources) },
                    { type: 'text', text: JSON.stringify(result) },
                ],
            };
        },
    );
}

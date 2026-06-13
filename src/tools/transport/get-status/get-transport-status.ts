import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { AppContext } from '../../../types.js';
import { resourceLabel } from '../../../utils/format.utils.js';
import { getTransportStatusInputSchema } from '../types.js';
import { GET_TRANSPORT_STATUS_DESCRIPTION } from './constants.js';

export function registerGetTransportStatusTool(server: McpServer, context: AppContext): void {
    server.registerTool(
        'get_transport_status',
        { description: GET_TRANSPORT_STATUS_DESCRIPTION, inputSchema: getTransportStatusInputSchema },
        async (args) => {
            const status = await context.transport.getStatus(args.jobId);
            const { resources } = await context.appConfig.load();
            const p = status.progress;
            const where = p.arrived
                ? 'arrived'
                : `@(${p.position.x.toFixed(1)},${p.position.y.toFixed(1)}) · ETA unix ${status.arrivalAt}`;
            const header =
                `Transport ${status.id}: ${status.status} · ${status.amount} ` +
                `${resourceLabel(resources, status.resourceId)} · ${p.traveledDistance.toFixed(1)}/${p.totalDistance} hops · ${where}`;

            return {
                content: [
                    { type: 'text', text: header },
                    { type: 'text', text: JSON.stringify(status) },
                ],
            };
        },
    );
}

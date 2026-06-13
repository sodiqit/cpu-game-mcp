import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { BUILD_DESCRIPTION } from './constants.js';
import { buildInputSchema } from './types.js';
import type { AppContext } from '../../types.js';
import { cpuFromWei, resourceLabel } from '../../utils/format.utils.js';

export function registerBuildTool(server: McpServer, context: AppContext): void {
    server.registerTool('build', { description: BUILD_DESCRIPTION, inputSchema: buildInputSchema }, async (args) => {
        const result = await context.build.build({
            tokenId: args.tokenId,
            buildingType: args.buildingType,
            targetResourceId: args.targetResourceId,
        });
        const { resources } = await context.appConfig.load();

        const approve = result.approveTxHash !== null ? `approve tx ${result.approveTxHash}, ` : '';
        const what =
            result.targetResourceId !== null
                ? `extractor mining ${resourceLabel(resources, result.targetResourceId)}`
                : 'hub';
        const followUp =
            result.targetResourceId !== null
                ? `Mining starts automatically — track it with get_mining_status ${result.tokenId}.`
                : `Inspect it with get_cell ${result.tokenId}.`;
        const header =
            `Built ${what} on cell ${result.tokenId} (paid ${cpuFromWei(result.cpuAmount)} $CPU): ${approve}build tx ` +
            `${result.txHash} confirmed in block ${result.blockNumber}. The building settles shortly. ${followUp}`;

        return {
            content: [
                { type: 'text', text: header },
                { type: 'text', text: JSON.stringify(result) },
            ],
        };
    });
}

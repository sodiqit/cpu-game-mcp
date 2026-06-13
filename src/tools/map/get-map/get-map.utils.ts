import type { GetMapArgs } from './types.js';
import { DEFAULT_AROUND_RADIUS } from '../../../map/constants.js';
import { type AroundQuery, type MapQuery, MapScope } from '../../../map/types.js';

export function resolveScope(requested: MapScope | null, ownerAddress: string | null): MapScope {
    if (requested !== null) {
        return requested;
    }
    return ownerAddress !== null ? MapScope.Mine : MapScope.Summary;
}

export function buildMapQuery(scope: MapScope, args: GetMapArgs, ownerAddress: string | null): MapQuery {
    if (scope === MapScope.Mine && ownerAddress === null) {
        throw new Error('scope="mine" needs a ready wallet — run the authenticate tool first.');
    }

    let around: AroundQuery | null = null;
    if (scope === MapScope.Around) {
        if (args.centerX === null || args.centerY === null) {
            throw new Error('scope="around" requires centerX and centerY.');
        }
        around = { x: args.centerX, y: args.centerY, radius: args.radius ?? DEFAULT_AROUND_RADIUS };
    }

    if (scope === MapScope.Cells && (args.tokenIds === null || args.tokenIds.length === 0)) {
        throw new Error('scope="cells" requires a non-empty tokenIds array.');
    }

    return { scope, tokenIds: args.tokenIds, around, ownerAddress };
}

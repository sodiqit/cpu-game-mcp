import type { CellBuildingView, CellMiningView, CellResource, CellState } from '../../map/types.js';
import { resourceName, type ResourceNames } from '../../utils/format.utils.js';

type LabeledResource = CellResource & { resourceName: string };
type LabeledBuilding = CellBuildingView & { targetResourceName: string | null };
type LabeledMining = CellMiningView & { targetResourceName: string };

/** Name for a nullable resource id — null when there is no target (e.g. a hub). */
function optionalResourceName(resources: ResourceNames, id: number | null): string | null {
    return id === null ? null : resourceName(resources, id);
}

function labelResource(resources: ResourceNames, resource: CellResource): LabeledResource {
    return { ...resource, resourceName: resourceName(resources, resource.resourceId) };
}

function labelBuilding(resources: ResourceNames, building: CellBuildingView | null): LabeledBuilding | null {
    if (building === null) {
        return null;
    }
    return { ...building, targetResourceName: optionalResourceName(resources, building.targetResourceId) };
}

function labelMining(resources: ResourceNames, mining: CellMiningView | null): LabeledMining | null {
    if (mining === null) {
        return null;
    }
    return { ...mining, targetResourceName: resourceName(resources, mining.targetResourceId) };
}

/**
 * Annotate a cell's resource ids with their display names from the chain config, so an agent reading
 * the map sees `resourceName: 'Silica'` beside `resourceId: 3` instead of a bare number. Resource ids
 * are otherwise meaningless to the model. Recipe ids (crafting) are left as-is — the config carries
 * no recipe names.
 */
export function labelCell<T extends CellState>(cell: T, resources: ResourceNames) {
    return {
        ...cell,
        resources: cell.resources.map((resource) => labelResource(resources, resource)),
        building: labelBuilding(resources, cell.building),
        mining: labelMining(resources, cell.mining),
    };
}

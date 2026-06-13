// Public world-map read. `?since=<version>` returns only cells changed after that version (a delta),
// so we can re-sync cheaply instead of re-fetching the whole map.
export const MAP_HTTP_PATH = '/api/v1/map';

// Namespace and engine path are distinct socket.io concepts: the namespace is appended to the base
// URL (`<base>/map`), the path is the engine mount. Conflating them is a classic connection bug.
export const MAP_SOCKET_NAMESPACE = '/map';
export const MAP_SOCKET_PATH = '/socket.io';

export const CELL_UPDATE_EVENT = 'cell_update';

// Axial hex neighbour offsets (6 directions) for the cube convention where `z = -x - y`, i.e.
// `hexDistance = (|dx| + |dy| + |dx + dy|) / 2`. Order is irrelevant to callers.
export const HEX_NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
];

export const DEFAULT_POLL_INTERVAL_MS = 30_000;
export const DEFAULT_RECONNECT_GRACE_MS = 5_000;
export const STARTUP_FETCH_RETRY_MS = 10_000;

// Input bound for the `around` scope (caps the query, not the response).
export const DEFAULT_AROUND_RADIUS = 2;
export const MAX_AROUND_RADIUS = 10;

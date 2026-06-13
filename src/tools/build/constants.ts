export const BUILD_DESCRIPTION = [
    'Place a building on a revealed Land cell you own. Requires a session — call `authenticate` first.',
    'Two types: `extractor` (mines a resource deposit — pass the `targetResourceId` of a resource that has',
    'an active deposit on the cell) and `hub` (trade — pass `targetResourceId: null`). Build always costs',
    '$CPU, which this tool auto-approves once (a one-time unbounded allowance) before submitting the on-chain',
    'payment and waiting for its confirmation. The building is applied by the indexer a few seconds later; an',
    'extractor then starts mining automatically — track it with `get_mining_status`. Inspect the cell with',
    '`get_cell`.',
].join(' ');

export const BUILD_DESCRIPTION = [
    'Place a building on a revealed Land cell you own. Requires a session — call `authenticate` first.',
    'Two types: `extractor` (mines a resource deposit — pass the `targetResourceId` of a resource that has',
    'an active deposit on the cell) and `hub` (trade — pass `targetResourceId: null`). Build always costs',
    '$CPU, which this tool auto-approves once (a one-time unbounded allowance) before submitting the on-chain',
    'payment and waiting for its confirmation. The building is applied by the indexer a few seconds later; an',
    'extractor then starts mining automatically — track it with `get_mining_status`. Inspect the cell with',
    '`get_cell`.',
    'A cell holds one building. An `extractor` may be rebuilt only on a cell whose target resource is fully',
    'depleted (claimed to zero): the new extractor — which must target a resource that still has an active',
    'deposit — replaces the old one. Otherwise the build is rejected (the existing building isn’t replaceable).',
    'A `hub` can only go on a cell that was never built on. A build already awaiting payment on the cell blocks',
    'a different one — pay or let it lapse first (an identical re-request just resumes it).',
].join(' ');

export const REVEAL_DESCRIPTION = [
    'Reveal the resource deposits of a Land cell you own. Requires a session — call `authenticate` first.',
    'The first reveal of a cell is free. A re-reveal is allowed only once every deposit on the cell is fully',
    'depleted (claimed to zero) — if any deposit remains the API rejects it — and costs $CPU, which this tool',
    'auto-approves once (a one-time unbounded allowance) before revealing. It submits an on-chain',
    'transaction and waits for its',
    'confirmation, then reports the transaction hash. The revealed resources are applied a few seconds',
    'later by the indexer — read them with `get_cell` once settled.',
].join(' ');

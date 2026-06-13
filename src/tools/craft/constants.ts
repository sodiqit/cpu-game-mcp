export const CRAFT_DESCRIPTION = [
    'Run a craft recipe on a cell you own (refine raw resources, or forge $WCPU). Requires a session —',
    'call `authenticate` first; discover recipes with `list_recipes`. Inputs are debited upfront for all',
    'batches. Most recipes are free and start their timer immediately; `forge_wcpu` costs $CPU, which this',
    'tool auto-approves once (a one-time unbounded allowance) before submitting the on-chain payment and',
    'waiting for its confirmation — its timer then starts once the indexer settles the payment a few seconds',
    'later. Track progress with `get_craft_status` and bank matured batches with `claim_craft`.',
].join(' ');

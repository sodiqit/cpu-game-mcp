export const QUOTE_TRANSPORT_DESCRIPTION = [
    'Preview a transport route without committing: returns whether it is free or paid, the hop distance and',
    'travel time, and (for a paid route through a foreign Hub) the exact $CPU fee, burn, and per-hub payouts.',
    'It has no side effects — it does not escrow resources. It also validates the route, surfacing the',
    'rejection reason and hop index if the path is invalid. Use it before `transport` to decide.',
].join(' ');

export const CANCEL_LOT_DESCRIPTION = [
    'Withdraw your lot; unsold units return to you. Requires a session.',
    'For an OPEN lot pass chain = [hub, ...waypoints, your destination cell] (the return shipment); omit',
    '`chain` only for a DRAFT lot (nothing has shipped yet). A return through a foreign Hub costs $CPU —',
    'auto-approved and paid on-chain — otherwise it is free. Track with `list_my_lots` / `get_lot`.',
].join(' ');

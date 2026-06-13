export const QUOTE_BUY_DESCRIPTION = [
    'Preview the cost of buying from a lot — non-destructive, reserves nothing. Requires a session.',
    'Pass `chain` = [hub, ...waypoints, your destination cell] for the exact total `buy_lot` would charge',
    '(seller price + transit fees + burn); omit it for a seller-only estimate (price × value). Use this before',
    '`buy_lot`, which reserves units immediately.',
].join(' ');

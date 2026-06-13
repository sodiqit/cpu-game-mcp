export const RESUME_TRANSPORT_DESCRIPTION = [
    'Finish paying a pending paid transport (from `get_pending_transports`) by its jobId: it re-submits the',
    'already-issued signature on-chain (auto-approving $CPU first), without creating a new transport or',
    're-escrowing. Safe to retry — it checks the signature deadline and the on-chain replay guard, and reports',
    'if the action is already paid or has expired.',
].join(' ');

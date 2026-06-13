export const GET_PENDING_TRANSPORTS_DESCRIPTION = [
    'List your paid transports awaiting on-chain payment — actions whose source resource is already escrowed',
    'and whose signature is still held server-side. Each entry shows the $CPU cost, deadline, and whether it is',
    'still resumable. Finish paying one with `resume_transport <jobId>`; an expired one is freed by re-initiating',
    'the same route with `transport`.',
].join(' ');

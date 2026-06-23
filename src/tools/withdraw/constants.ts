export const WITHDRAW_DESCRIPTION = [
    'Cash out a cell’s wCPU (resource id 1, the Tier-5 CPU Forge output) into the on-chain $CPU token in',
    'your wallet, 1:1. Requires a session — call `authenticate` first. Pass the amount in whole wCPU units',
    '(e.g. "100"), at most 1,000,000 per withdraw. This debits the wCPU from the cell and mints $CPU straight',
    'to your wallet, so no $CPU approve is needed; it submits the on-chain transaction and waits for its',
    'confirmation, then reports the tx hash — check the credited $CPU with `get_balance`.',
    'You can have only one withdraw in flight at a time. If the on-chain step is interrupted, re-run `withdraw`',
    'with the same tokenId and amount to finish it — your wCPU is held until then.',
    'wCPU lives on the cell, not your wallet: selling or transferring the cell takes its wCPU with it, so',
    'withdraw before you sell.',
].join(' ');

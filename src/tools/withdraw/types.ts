import { z } from 'zod';

export const withdrawInputSchema = {
    tokenId: z.string().describe('The tokenId of a cell you own holding wCPU to cash out.'),
    amount: z
        .string()
        .regex(/^\d+(\.\d+)?$/, 'amount must be a positive number of wCPU in whole units (e.g. "100")')
        .describe(
            'How much wCPU (resource id 1) to convert to on-chain $CPU, 1:1, in whole units (e.g. "100"). ' +
                'Must be greater than 0 and at most 1,000,000 per withdraw. ' +
                'See the cell’s wCPU balance with get_cell.',
        ),
};

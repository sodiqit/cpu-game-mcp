import { z } from 'zod';

export const miningStatusInputSchema = {
    tokenId: z.string().describe('The tokenId of the cell to inspect mining for.'),
};

export const claimMiningInputSchema = {
    tokenId: z.string().describe('The tokenId of a cell you own with an extractor, to bank its accrued resources.'),
};

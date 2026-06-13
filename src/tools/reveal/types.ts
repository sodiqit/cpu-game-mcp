import { z } from 'zod';

export const revealInputSchema = {
    tokenId: z.string().describe('The tokenId of a cell you own to reveal.'),
};

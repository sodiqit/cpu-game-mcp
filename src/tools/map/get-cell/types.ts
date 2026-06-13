import { z } from 'zod';

export const getCellInputSchema = {
    tokenId: z.string().describe('The cell tokenId to inspect.'),
};

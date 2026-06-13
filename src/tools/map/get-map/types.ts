import { z } from 'zod';

import { DEFAULT_AROUND_RADIUS, MAX_AROUND_RADIUS } from '../../../map/constants.js';
import { MapScope } from '../../../map/types.js';

export const getMapInputSchema = {
    scope: z
        .nativeEnum(MapScope)
        .nullable()
        .default(null)
        .describe('mine | around | cells | all | summary. Omit to default to "mine" (or "summary" if no wallet).'),
    tokenIds: z
        .array(z.string())
        .nullable()
        .default(null)
        .describe('Required for scope="cells": the cell tokenIds to return.'),
    centerX: z.number().int().nullable().default(null).describe('Axial x of the centre for scope="around".'),
    centerY: z.number().int().nullable().default(null).describe('Axial y of the centre for scope="around".'),
    radius: z
        .number()
        .int()
        .min(0)
        .max(MAX_AROUND_RADIUS)
        .nullable()
        .default(null)
        .describe(`Hex radius for scope="around" (default ${DEFAULT_AROUND_RADIUS}, max ${MAX_AROUND_RADIUS}).`),
};

export interface GetMapArgs {
    scope: MapScope | null;
    tokenIds: Array<string> | null;
    centerX: number | null;
    centerY: number | null;
    radius: number | null;
}

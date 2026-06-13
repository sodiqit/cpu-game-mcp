import { z } from 'zod';

import { TransportStatus } from '../../api/types.js';

const coord = z.object({
    x: z.number().describe('Axial hex x.'),
    y: z.number().describe('Axial hex y.'),
});

// Shared by `transport` (commit) and `quote_transport` (preview) — same route input.
export const transportInputSchema = {
    path: z
        .array(coord)
        .min(2)
        .describe(
            'Waypoint chain [source, ...intermediate, target] in axial hex coords. Each hop must be within reach, ' +
                'and every waypoint revealed and eligible (your own cell, or a Hub). The API validates the physics.',
        ),
    resourceId: z.number().int().describe('Resource type id to move (must have a balance at the source cell).'),
    amount: z
        .string()
        .regex(/^[1-9]\d*$/)
        .describe('Units to move, as a positive integer string (matches on-map resource balances).'),
};

export const getTransportStatusInputSchema = {
    jobId: z.number().int().describe('The transport jobId (from `transport` or `list_my_transports`).'),
};

export const listMyTransportsInputSchema = {
    status: z
        .nativeEnum(TransportStatus)
        .nullable()
        .default(null)
        .describe(
            'Optional status filter (in_transit, delivered, awaiting_payment, cancelled, reverted). Omit for all.',
        ),
};

export const resumeTransportInputSchema = {
    jobId: z
        .number()
        .int()
        .describe('The jobId of a pending paid transport (from `get_pending_transports`) to finish paying.'),
};

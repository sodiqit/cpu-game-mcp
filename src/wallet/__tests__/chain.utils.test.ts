import { describe, expect, it } from 'vitest';

import { viemChainForChainId } from '../chain.utils.js';

describe('viemChainForChainId', () => {
    it('maps each supported chainId to its viem chain', () => {
        for (const id of [1, 11155111, 8453, 84532]) {
            expect(viemChainForChainId(id).id).toBe(id);
        }
    });

    it('throws for an unsupported chainId', () => {
        expect(() => viemChainForChainId(999999)).toThrow(/unsupported chainid/i);
    });
});

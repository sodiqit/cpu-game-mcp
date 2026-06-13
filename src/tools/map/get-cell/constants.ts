export const GET_CELL_DESCRIPTION = [
    'Inspect a single cell in depth (any owner — the map is public). Returns the cell, its neighbours',
    'expanded as full cell states (not just refs, so you see the immediate surroundings of a target),',
    'and the hex distance to your nearest cell (null if your wallet is unknown).',
    'Use this to study a specific target; use get_map for broader situational awareness.',
].join(' ');

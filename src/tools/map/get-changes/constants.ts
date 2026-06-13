export const GET_CHANGES_DESCRIPTION = [
    'Get only the cells that changed since a given version — react to other players without re-reading',
    'the whole map. Workflow: take "version" from a previous map response, remember it, and pass it back',
    'here next time; the response carries a new "version" to use on the following call.',
    'Omit sinceVersion (or pass 0) to get everything.',
].join(' ');

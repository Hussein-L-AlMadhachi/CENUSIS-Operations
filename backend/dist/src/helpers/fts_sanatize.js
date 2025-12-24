export function prepareFtsPrefixQuery(input) {
    // For autocomplete, we usually want simple word prefixes.
    // Strip FTS metacharacters that break parsing or alter meaning.
    return input
        .replace(/["'()&|!:<>*]/g, ' ') // remove FTS operators
        .replace(/\s+/g, ' ') // collapse spaces
        .trim()
        .concat(':*'); // add prefix wildcard
}
//# sourceMappingURL=fts_sanatize.js.map
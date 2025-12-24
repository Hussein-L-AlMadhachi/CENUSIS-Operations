export function translateHeaders(data, translations) {
    let result = [];
    for (const row of data) {
        const new_data = {};
        for (const key in row) {
            const new_key = translations[key];
            if (new_key === undefined) {
                throw new Error(`unexpected header ${key}`);
            }
            new_data[new_key] = row[key];
        }
        result.push(new_data);
    }
    return result;
}
//# sourceMappingURL=headers_translate.js.map
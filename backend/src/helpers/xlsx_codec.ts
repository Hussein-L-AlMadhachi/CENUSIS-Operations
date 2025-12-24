import ExcelJS from 'exceljs';



export async function decodeXlsx<T extends Record<string, any>>(
    buffer: any,
    headersToExtract: string[]
): Promise<T[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];
    const data: T[] = [];

    if (!worksheet) return data;

    const headerRow = worksheet.getRow(1);
    const headerMap: Record<number, string> = {};

    headerRow.eachCell((cell, colNumber) => {
        const headerVal = cell.text;
        if (headersToExtract.includes(headerVal)) {
            headerMap[colNumber] = headerVal;
        }
    });

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData: any = {};
        let hasData = false;

        for (const [colNumber, headerName] of Object.entries(headerMap)) {
            const cell = row.getCell(Number(colNumber));
            // Use .value or .text depending on needs, .value preserves types better
            rowData[headerName] = cell.value;
            hasData = true;
        }

        if (hasData) {
            data.push(rowData);
        }
    });

    return data;
}
[
    { name: "Hussein", age: 21 },
    { name: "Ashraf", age: 24 },
]


export async function encodeXlsx(
    data: Record<string, any>[],
    headersToInclude: string[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Set up columns based on the headers provided
    worksheet.columns = headersToInclude.map((header) => ({
        header: header,
        key: header,
        width: 20, // Default width
    }));

    // Add rows
    // Filter each object to only include specified keys
    const rows = data.map((item) => {
        const filteredItem: Record<string, any> = {};
        headersToInclude.forEach((header) => {
            filteredItem[header] = item[header];
        });
        return filteredItem;
    });

    worksheet.addRows(rows);

    // Return buffer
    const buffer = (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
    return buffer;
}

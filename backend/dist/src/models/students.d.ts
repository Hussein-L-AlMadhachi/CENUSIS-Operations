import { PG_Table, type PG_App } from "pg-norm";
export declare class StudentsTable extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    autocomplete(searched_name: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    findByName(normalized_name: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
//# sourceMappingURL=students.d.ts.map
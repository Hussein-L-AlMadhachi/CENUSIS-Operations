import { PG_Table, type PG_App } from "pg-norm";
export declare class Subjects extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    filterByYear(year: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByTeacher(teacher_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByName(name: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
//# sourceMappingURL=subjects.d.ts.map
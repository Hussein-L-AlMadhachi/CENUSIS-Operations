import { PG_Table, type PG_App } from "pg-norm";
export declare class StudentsTable extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    autocomplete(searched_name: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    listAll(): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    importData(data: Record<string, string>[]): Promise<void>;
    findByName(student_normalized_name: string): Promise<import("postgres").Row | undefined>;
    filterStudentsByClassDegree(degree: string, student_class: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterStudentsByDegree(degree: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
//# sourceMappingURL=students.d.ts.map
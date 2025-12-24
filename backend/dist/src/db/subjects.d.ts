import { PG_Table, type PG_App } from "pg-norm";
export declare class Subjects extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    autocomplete(searched_name: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByYear(year: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    listAll(): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByClassDegree(degree: string, class_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByDegree(degree: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    findByName(name: string): Promise<import("postgres").Row | undefined>;
    filterByTeacherClassDegree(teacher_id: number, degree: string, class_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByTeacherDegree(teacher_id: number, degree: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
//# sourceMappingURL=subjects.d.ts.map
import { PG_Table, type PG_App } from "pg-norm";
export declare class Courses extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    setCourseworkGrade(grade: number, raw_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    addAbcentHours(hours: number, raw_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    clearOldRecords(year: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
export declare const courses: Courses;
//# sourceMappingURL=courses.d.ts.map
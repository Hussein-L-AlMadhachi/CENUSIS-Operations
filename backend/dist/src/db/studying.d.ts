import { PG_Table, type PG_App } from "pg-norm";
export declare class Studying extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    setCourseworkGrade(grade: number, subject_id: number, student_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    getCourseworkGrades(studying_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    clearOldRecords(year: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    findBySubject(subject_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    autoInsertStudentsForSubject(subject_id: number, degree: string, _class: number, studying_year: number, coursework_grade_percent: number, finals_grade_percent: number): Promise<void>;
}
//# sourceMappingURL=studying.d.ts.map
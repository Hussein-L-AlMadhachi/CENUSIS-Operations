import { PG_Table, type PG_App } from "pg-norm";
export declare class Absented extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    findByAttendanceRecord(attendance_record_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    markAbsent(student_id: number, attendance_record_id: number, hours_absent: number): Promise<void>;
    removeAbsence(absented_id: number): Promise<void>;
}
//# sourceMappingURL=absented.d.ts.map
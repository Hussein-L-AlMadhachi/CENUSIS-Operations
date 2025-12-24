import { PG_Table, type PG_App } from "pg-norm";
import type postgres from "postgres";
export declare class AttendanceRecord extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    findBySubject(subject_id: number): Promise<postgres.RowList<postgres.Row[]>>;
    delete(attendance_record_id: number): Promise<postgres.RowList<postgres.Row[]>>;
}
//# sourceMappingURL=attendance_record.d.ts.map
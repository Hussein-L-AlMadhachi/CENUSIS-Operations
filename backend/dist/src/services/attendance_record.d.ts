import type { Metadata } from "enders-sync";
import type postgres from "postgres";
export declare function createDailyAttendanceRecord(metadata: Metadata, subject_id: number, date: string): Promise<postgres.RowList<postgres.Row[]>>;
export declare function fetchDailyAttendanceRecordsForTheSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>>;
//# sourceMappingURL=attendance_record.d.ts.map
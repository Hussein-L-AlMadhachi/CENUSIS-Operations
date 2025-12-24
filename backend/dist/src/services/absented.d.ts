import type { Metadata } from "enders-sync";
export declare function markStudentAbsent(metadata: Metadata, data: any): Promise<void>;
export declare function fetchAbsentStudents(metadata: Metadata, attendance_record_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
export declare function removeAbsence(metadata: Metadata, absented_id: number): Promise<void>;
//# sourceMappingURL=absented.d.ts.map
import type { Metadata } from "enders-sync";
import type postgres from "postgres";
export declare function newEnrollment(metadata: Metadata, data: any): Promise<void>;
export declare function updateEnrollment(metadata: Metadata, id: number, data: any): Promise<number>;
export declare function deleteEnrollment(metadata: Metadata, id: number): Promise<void>;
export declare function fetchSingleEnrollment(metadata: Metadata, id: number): Promise<postgres.Row>;
export declare function fetchEnrollmentsForSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>>;
export declare function fetchCourseworkGradesWithDataForSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>>;
//# sourceMappingURL=enrollments.d.ts.map
import type { Metadata } from "enders-sync";
import type postgres from "postgres";
export declare function newEnrollment(metadata: Metadata, data: any): Promise<void>;
export declare function updateEnrollment(metadata: Metadata, id: number, data: any): Promise<number>;
export declare function deleteEnrollment(metadata: Metadata, id: number): Promise<void>;
export declare function fetchSingleEnrollment(metadata: Metadata, id: number): Promise<postgres.Row>;
export declare function fetchEnrollmentsForSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>>;
export declare function fetchCourseworkGradesWithDataForSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>>;
export declare function setCourseworkGradeAndFinalsGrade(metadata: Metadata, coursework_grade: number, student_id: number, subject_id: number): Promise<void>;
export declare function autoFillStudentsByDegreeClass(metadata: Metadata, degree: string, class_number: number, subject_id: number, studying_year: number, coursework_grade_percent: number, finals_grade_percent: number): Promise<void>;
//# sourceMappingURL=studying.d.ts.map
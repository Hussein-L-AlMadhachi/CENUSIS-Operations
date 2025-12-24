import type { Metadata } from "enders-sync";
import type postgres from "postgres";
export declare function newStudent(metadata: Metadata, data: any): Promise<any>;
export declare function updateStudent(metadata: Metadata, uid: number, data: any): Promise<number>;
export declare function deleteStudent(metadata: Metadata, id: number): Promise<void>;
export declare function fetchStudentInfo(metadata: Metadata, id: number): Promise<postgres.Row>;
export declare function fetchStudents(metadata: Metadata): Promise<postgres.RowList<postgres.Row[]>>;
export declare function filterStudentsByClassDegree(metadata: Metadata, degree: string, student_class: number): Promise<postgres.RowList<postgres.Row[]>>;
export declare function filterStudentsByDegree(metadata: Metadata, degree: string): Promise<postgres.RowList<postgres.Row[]>>;
export declare function autocompleteStudent(metadata: Metadata, name: string): Promise<string[]>;
export declare function findStudentByName(metadata: Metadata, name: string): Promise<postgres.Row>;
//# sourceMappingURL=students.d.ts.map
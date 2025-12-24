import type { Metadata } from "enders-sync";
import type postgres from "postgres";
export declare function newSubject(metadata: Metadata, data: any): Promise<any>;
export declare function updateSubject(metadata: Metadata, id: number, data: any): Promise<number>;
export declare function deleteSubject(metadata: Metadata, id: number): Promise<void>;
export declare function fetchSingleSubject(metadata: Metadata, id: number): Promise<postgres.Row>;
export declare function fetchSubjects(metadata: Metadata): Promise<postgres.RowList<postgres.Row[]>>;
export declare function filterSubjectsByClassDegree(metadata: Metadata, degree: string, subject_class: number): Promise<postgres.RowList<postgres.Row[]>>;
export declare function filterSubjectsByDegree(metadata: Metadata, degree: string): Promise<postgres.RowList<postgres.Row[]>>;
export declare function autocompleteSubject(metadata: Metadata, name: string): Promise<string[]>;
export declare function findSubjectByName(metadata: Metadata, name: string): Promise<postgres.Row>;
export declare function fetchSubjectsByTeacher(metadata: Metadata, degree: string, subject_class?: number): Promise<postgres.RowList<postgres.Row[]>>;
//# sourceMappingURL=subjects.d.ts.map
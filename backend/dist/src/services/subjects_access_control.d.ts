import type { Metadata } from "enders-sync";
export declare function fetchSubjectAccessControl(metadata: Metadata, subject_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
export declare function grantAccess(metadata: Metadata, subject_name: string, teacher_name: string): Promise<void>;
export declare function revokeAccess(metadata: Metadata, subject_id: number, user_id: number): Promise<void>;
export declare function fetch_ta_subject_list(metadata: Metadata, degree: string, subject_class?: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
//# sourceMappingURL=subjects_access_control.d.ts.map
import { PG_Table, type PG_App } from "pg-norm";
export declare class SubjectsAccessControl extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    is_auth(subject_id: number, user_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    is_owner(subject_id: number, user_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    revoke(subject_id: number, user_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    grant(subject_id: number, user_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    create_original_owner(subject_id: number, user_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    fetchForUser(user_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    fetchForSubject(subject_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    fetchForSubjectAndUser(subject_id: number, user_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByClassDegree(uid: number, degree: string, class_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    filterByDegree(uid: number, degree: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
//# sourceMappingURL=subjects_access_control.d.ts.map
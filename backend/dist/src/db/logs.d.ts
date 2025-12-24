import { PG_Table, type PG_App } from "pg-norm";
import type postgres from "postgres";
export declare class ActivityLogs extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    log(user_id: number, username: string, role: string, activity: string, useragent: string, ip: string): Promise<postgres.RowList<postgres.Row[]>>;
    fetchUserLogs(row_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    fetchAllLogs(): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    fetchUserLogsByRole(row_id: number, role: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
//# sourceMappingURL=logs.d.ts.map
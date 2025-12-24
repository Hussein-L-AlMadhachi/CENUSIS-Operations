import { PG_AuthTable, type PG_App } from "pg-norm";
export declare class LoggedinUsers extends PG_AuthTable {
    constructor(app: PG_App);
    create(): Promise<void>;
    findByUserName(normalized_username: string): Promise<import("postgres").Row | undefined>;
}
//# sourceMappingURL=loggedin_users.d.ts.map
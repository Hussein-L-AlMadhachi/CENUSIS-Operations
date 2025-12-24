import { PG_AuthTable, type PG_App } from "pg-norm";
export declare class LoggedinUsers extends PG_AuthTable {
    constructor(app: PG_App);
    create(): Promise<void>;
}
export declare const loggedin_users: LoggedinUsers;
//# sourceMappingURL=loggedin_users.d.ts.map
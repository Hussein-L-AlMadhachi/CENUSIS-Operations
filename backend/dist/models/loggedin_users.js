import { PG_AuthTable, PG_Table } from "pg-norm";
import { app } from "../db.js";
import { subjects } from "./subjects.js";
import { teaching_staff } from "./teaching_staff.js";
export class LoggedinUsers extends PG_AuthTable {
    constructor(app) {
        super(app, "loggedin_users", [
            "id", "username", "role", "teacher"
        ], "username");
    }
    async create() {
        await this.sql `
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                     SERIAL PRIMARY KEY,
                username               VARCHAR(100) NOT NULL,
                nomalized_username     VARCHAR(150) NOT NULL,
                ${this.sql(this.passwordField)}  VARCHAR(100) NOT NULL,
                role                   VARCHAR(20) NOT NULL,
                teacher                INTEGER NULL,
                FOREIGN KEY (teacher) REFERENCES teaching_staff(id)
            );
        `;
    }
}
export const loggedin_users = new LoggedinUsers(app);
//# sourceMappingURL=loggedin_users.js.map
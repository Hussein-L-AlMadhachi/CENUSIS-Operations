import { PG_AuthTable } from "pg-norm";
import { teaching_staff } from "../db.js";
export class LoggedinUsers extends PG_AuthTable {
    constructor(app) {
        super(app, "loggedin_users", [
            "id", "username", "normalized_username",
            "role", "teacher"
        ], "normalized_username");
    }
    async create() {
        await this.sql `
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                     SERIAL PRIMARY KEY,
                username               VARCHAR(100) NOT NULL,
                normalized_username     VARCHAR(150) UNIQUE NOT NULL,
                ${this.sql(this.passwordField)}  VARCHAR(100) NOT NULL,
                role                   VARCHAR(20) NOT NULL,
                teacher                INTEGER NULL,
                FOREIGN KEY (teacher) REFERENCES ${this.sql(teaching_staff.table_name)}(id)
            );
        `;
    }
}
//# sourceMappingURL=loggedin_users.js.map
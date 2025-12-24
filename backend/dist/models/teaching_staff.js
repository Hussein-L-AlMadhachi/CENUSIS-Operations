import { PG_Table } from "pg-norm";
import { app } from "../db.js";
import { loggedin_users } from "./loggedin_users.js";
export class TeachingStaff extends PG_Table {
    constructor(app) {
        super(app, "teaching_staff", ["id", "name", "nomalized_name", "availability_bitmap", "hours_available"]);
    }
    /** NOTE: availability_bitmap is used for automatic time table generation */
    async create() {
        await this.sql `
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                    SERIAL PRIMARY KEY,
                name                  VARCHAR(150) NOT NULL,
                nomalized_name        VARCHAR(150) NOT NULL,
                availability_bitmap   BIGINT  DEFAULT 0,
                hours_available       INTEGER DEFAULT 0
            );
        `;
    }
    async insert(data) {
        const keys = Object.keys(data);
        // validate keys
        for (const key of keys) {
            if (!this.visibles.includes(key)) {
                throw new Error("inserted rows need to have all columns in visibles");
            }
        }
        return this.sql.begin(async (sql) => {
            const teacher_id = await sql `
                WITH inserted_data AS (
                    INSERT INTO ${this.sql(this.table_name)}
                    ${this.sql(data, ...keys)}
                    RETURNING id, name
                )
                INSERT INTO ${this.sql(loggedin_users.table_name)} (id, name, role)
                (SELECT id, name, 'teacher'
                FROM inserted_data)
                RETURNING id;`;
            return teacher_id;
        });
    }
}
export const teaching_staff = new TeachingStaff(app);
//# sourceMappingURL=teaching_staff.js.map
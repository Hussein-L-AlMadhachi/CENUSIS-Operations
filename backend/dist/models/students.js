import { PG_Table } from "pg-norm";
import { app } from "../db.js";
export class StudentsTable extends PG_Table {
    constructor(app) {
        super(app, "students_table", [
            "id", "name", "joined_year", "class",
            "years_retaken", "years_failed", "courses_failed"
        ]);
    }
    async create() {
        await this.sql `
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id              SERIAL PRIMARY KEY,
                name            VARCHAR(150) NOT NULL,
                joined_year     INTEGER NOT NULL,
                degree          VARCHAR(20) NOT NULL,
                class           INTEGER NOT NULL,
                years_retaken   INTEGER DEFAULT 0,
                years_failed    INTEGER DEFAULT 0,
                courses_failed  INTEGER DEFAULT 0
            );
        `;
    }
}
export const students = new StudentsTable(app);
//# sourceMappingURL=students.js.map
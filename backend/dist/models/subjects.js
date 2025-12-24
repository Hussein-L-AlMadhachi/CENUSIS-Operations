import { PG_Table } from "pg-norm";
import { app } from "../db.js";
export class Subjects extends PG_Table {
    constructor(app) {
        super(app, "subjects", ["id", "name", "teacher", "year", "class", "total_hours"]);
    }
    async create() {
        await this.sql `
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (

                id          SERIAL PRIMARY KEY,
                name        VARCHAR(150) NOT NULL,
                teacher     INTEGER NOT NULL,
                year        INTEGER NOT NULL,
                class       INTEGER NOT NULL,
                total_hours INTEGER NOT NULL,

                FOREIGN KEY (teacher) REFERENCES teaching_staff(id)
            );
        `;
    }
    async filterByYear(year) {
        return await this.sql `select ${this.sql(this.visibles)} FROM subjects WHERE year=${year}`;
    }
    async filterByTeacher(teacher_id) {
        return await this.sql `select ${this.sql(this.visibles)} FROM subjects WHERE teacher=${teacher_id}`;
    }
    async filterByName(name) {
        return await this.sql `select ${this.sql(this.visibles)} FROM subjects WHERE name=${name}`;
    }
}
export const subjects = new Subjects(app);
//# sourceMappingURL=subjects.js.map
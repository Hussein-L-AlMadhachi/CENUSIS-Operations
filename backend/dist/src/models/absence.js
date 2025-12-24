import { PG_Table } from "pg-norm";
import { courses, students } from "../db.js";
export class Absence extends PG_Table {
    constructor(app) {
        super(app, "absence", [
            "id", "student", "course", "is_attending", "created_at", "updated_at"
        ]);
    }
    async create() {
        await this.sql `        
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                    SERIAL PRIMARY KEY,
                course                INTEGER NOT NULL,
                student               INTEGER NOT NULL,
                is_attending          BOOLEAN NOT NULL,
                created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course) REFERENCES ${this.sql(courses.table_name)}(id),
                FOREIGN KEY (student) REFERENCES ${this.sql(students.table_name)}(id)
            );
        `;
    }
}
//# sourceMappingURL=absence.js.map
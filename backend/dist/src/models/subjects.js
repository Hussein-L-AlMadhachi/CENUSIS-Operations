import { PG_Table } from "pg-norm";
export class Subjects extends PG_Table {
    constructor(app) {
        super(app, "subjects", [
            "id", "name", "normalized_name", "teacher",
            "degree", "class", "total_hours", "hours_weekly"
        ]);
    }
    async create() {
        await this.sql.begin(async (tx) => {
            await tx `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;
            await tx `CREATE EXTENSION IF NOT EXISTS pg_trgm`;
            await this.sql `
                CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (

                    id                  SERIAL PRIMARY KEY,
                    name                VARCHAR(150) NOT NULL,
                    normalized_name     VARCHAR(150) UNIQUE NOT NULL,

                    teacher             INTEGER NOT NULL,

                    degree              VARCHAR(150) NOT NULL,
                    class               INTEGER NOT NULL,

                    total_hours         INTEGER NOT NULL,
                    hours_weekly        INTEGER NOT NULL,

                    FOREIGN KEY (teacher) REFERENCES teaching_staff(id)
                );
            `;
            await tx `
                CREATE INDEX IF NOT EXISTS ${tx(`${this.table_name}_name_trgm_idx`)}
                ON ${tx(this.table_name)}
                USING GIST (normalized_name gist_trgm_ops)
            `;
        });
    }
    async filterByYear(year) {
        return await this.sql `select ${this.sql(this.visibles)} FROM subjects WHERE year=${year}`;
    }
    async filterByTeacher(teacher_id) {
        return await this.sql `select ${this.sql(this.visibles)} FROM subjects WHERE teacher=${teacher_id}`;
    }
    async filterByName(name) {
        return await this.sql `select ${this.sql(this.visibles)} FROM subjects WHERE normalized_name=${name}`;
    }
}
//# sourceMappingURL=subjects.js.map
import { PG_Table } from "pg-norm";
import { teaching_staff, subjects, students } from "../db.js";
export class Courses extends PG_Table {
    constructor(app) {
        super(app, "courses", [
            "id", "title", "teacher", "student", "subject", "retakes",
            "class", "degree", "year_joined", "max_allowed_retakes",
            "hours_missed", "coursework_grade", "coursework_grade_percent",
            "finals_grade_percent", "is_locked", "is_published"
        ]);
    }
    async create() {
        await this.sql.begin(async (tx) => {
            await tx `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;
            // 1. Create extension (safe to run in transaction)
            await tx `CREATE EXTENSION IF NOT EXISTS pg_trgm`;
            // 2. Create table
            await tx `
                CREATE TABLE IF NOT EXISTS ${tx(this.table_name)} (
                    id                              SERIAL PRIMARY KEY,
                    title                           VARCHAR(150) NOT NULL,
                    normalized_title                VARCHAR(150) UNIQUE NOT NULL,

                    teacher                         INTEGER NOT NULL,
                    student                         INTEGER NOT NULL,
                    subject                         INTEGER NOT NULL,

                    retakes                         INTEGER DEFAULT 0,
                    max_allowed_retakes             INTEGER NOT NULL,

                    degree                          VARCHAR(20) NOT NULL,    
                    class                           INTEGER NOT NULL,
                    year_joined                     INTEGER NOT NULL,

                    hours_missed                    INTEGER DEFAULT 0,
                    coursework_grade                INTEGER NOT NULL,

                    coursework_grade_percent        INTEGER NOT NULL,
                    finals_grade_percent            INTEGER NOT NULL,

                    is_locked                       BOOLEAN DEFAULT FALSE,
                    is_published                    BOOLEAN DEFAULT FALSE,

                    FOREIGN KEY (teacher) REFERENCES ${tx(teaching_staff.table_name)}(id),
                    FOREIGN KEY (student) REFERENCES ${tx(students.table_name)}(id),
                    FOREIGN KEY (subject) REFERENCES ${tx(subjects.table_name)}(id)
                )
            `;
            // 3. Create index
            await tx `
                CREATE INDEX IF NOT EXISTS courses_title_trgm_idx 
                ON ${tx(this.table_name)} 
                USING GIST (normalized_title gist_trgm_ops)
            `;
        });
    }
    async autocomplete(searched_name) {
        return await this.sql `
            SELECT normalized_title, word_similarity(${searched_name}, normalized_title) AS score
            FROM ${this.sql(this.table_name)} 
            WHERE ${searched_name} <% normalized_title
            ORDER BY score DESC
            LIMIT 10;
        `;
    }
    async setCourseworkGrade(grade, raw_id) {
        return await this.sql `
            UPDATE  ${this.sql(this.table_name)}
            SET coursework_grade=${grade} WHERE id=${raw_id}
        `;
    }
    async addAbcentHours(hours, raw_id) {
        return await this.sql `
            UPDATE  ${this.sql(this.table_name)}
            SET hours_missed=hours_missed+${hours} WHERE id=${raw_id}
        `;
    }
    async clearOldRecords(year) {
        return this.sql `
            DELETE FROM ${this.sql(this.table_name)} WHERE year_joined < ${year};
        `;
    }
}
//# sourceMappingURL=courses.js.map
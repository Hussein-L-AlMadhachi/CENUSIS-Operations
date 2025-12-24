import { PG_AuthTable, PG_Table } from "pg-norm";
import { app } from "../db.js";
import { teaching_staff } from "./teaching_staff.js";
import { subjects } from "./subjects.js";
import { students } from "./students.js";
export class Courses extends PG_Table {
    constructor(app) {
        super(app, "courses", [
            "id", "title", "teacher", "student", "retakes", "class", "year_joined",
            "max_allowed_retakes", "hours_missed", "coursework_grade", "coursework_2_final_exam_ratio"
        ]);
    }
    async create() {
        await this.sql `
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                              SERIAL PRIMARY KEY,
                title                           VARCHAR(150) NOT NULL,

                teacher                         INTEGER NOT NULL,
                student                         INTEGER NOT NULL,
                subject                         INTEGER NOT NULL,

                teacherName                     VARCHAR(150) NOT NULL,
                studentName                     VARCHAR(150) NOT NULL,

                retakes                         INTEGER DEFAULT 0,
                degree                          VARCHAR(20) NOT NULL,    
                class                           INTEGER NOT NULL,
                year_joined                     INTEGER NOT NULL,

                max_allowed_retakes             INTEGER NOT NULL,

                hours_missed                    INTEGER DEFAULT 0,
                coursework_grade                INTEGER NULL,

                coursework_grade_percent        INTEGER NOT NULL,
                finals_grade_percent            INTEGER NOT NULL,

                is_locked                       BOOLEAN,

                FOREIGN KEY (teacher) REFERENCES ${this.sql(teaching_staff.table_name)}(id),
                FOREIGN KEY (student) REFERENCES ${this.sql(students.table_name)}(id),
                FOREIGN KEY (subject) REFERENCES ${this.sql(subjects.table_name)}(id)
            );
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
export const courses = new Courses(app);
//# sourceMappingURL=courses.js.map
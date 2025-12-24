import { PG_Table, type PG_App } from "pg-norm";
import { teaching_staff, subjects, students } from "../db.js";



export class Studying extends PG_Table {

    constructor(app: PG_App) {
        super(app, "studying", [
            "id", "teacher", "student", "subject", "exam_retakes",
            "semester_retakes", "studying_year", "hours_missed",
            "coursework_grade_percent", "finals_grade_percent",
            "is_attending_required", "is_submitted"
        ]);
    }

    async create() {
        await this.sql.begin(async sql => {

            await sql`
                CREATE TABLE IF NOT EXISTS ${sql(this.table_name)} (
                    id                              SERIAL PRIMARY KEY,

                    teacher                         INTEGER NOT NULL,

                    student                         INTEGER NOT NULL,
                    subject                         INTEGER NOT NULL,
                    studying_year                   INTEGER NOT NULL,
                    coursework_grade_percent        INTEGER NOT NULL,
                    finals_grade_percent            INTEGER NOT NULL,

                    exam_retakes                    INTEGER DEFAULT 0,
                    semester_retakes                INTEGER DEFAULT 0,

                    hours_missed                    INTEGER DEFAULT 0,
                    coursework_grade                INTEGER DEFAULT 0, -- not visible so it doesn't get leaked or changed by generic fetchers/updaters

                    is_submitted                    BOOLEAN DEFAULT FALSE,

                    CHECK (coursework_grade_percent BETWEEN 0 AND 100),
                    CHECK (finals_grade_percent BETWEEN 0 AND 100),
                    CHECK (coursework_grade <= coursework_grade_percent AND coursework_grade >= 0),
                    CHECK (hours_missed >= 0),

                    FOREIGN KEY (student) REFERENCES ${sql(students.table_name)}(id),
                    FOREIGN KEY (subject) REFERENCES ${sql(subjects.table_name)}(id),
                    FOREIGN KEY (teacher) REFERENCES ${sql(teaching_staff.table_name)}(id)
                )
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS  ${sql(`idx_${this.table_name}_teacher`)}
                    ON ${sql(this.table_name)} (teacher);
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS  ${sql(`idx_${this.table_name}_student_subject`)}
                    ON ${sql(this.table_name)} (student, subject);
            `;

        });
    }

    public async setCourseworkGrade(grade: number, subject_id: number, student_id: number) {
        return await this.sql`
            UPDATE  ${this.sql(this.table_name)}
            SET coursework_grade=${grade} WHERE subject=${subject_id} AND student=${student_id}
        `;
    }

    public async getCourseworkGrades(studying_id: number) {
        return await this.sql`
            SELECT
                STUDYING.id,
                TEACHER.id AS teacher_id,
                STUDENT.student_name,
                SUBJECT.subject_name,
                TEACHER.teacher_name,
                STUDYING.coursework_grade 
            FROM ${this.sql(this.table_name)} AS STUDYING
            JOIN ${this.sql(students.table_name)} AS STUDENT
                ON STUDYING.student=STUDENT.id
            JOIN ${this.sql(subjects.table_name)} AS SUBJECT
                ON STUDYING.subject=SUBJECT.id
            JOIN ${this.sql(teaching_staff.table_name)} AS TEACHER
                ON STUDYING.teacher=TEACHER.id
            WHERE STUDYING.id=${studying_id};
        `;
    }

    public async clearOldRecords(year: number) {
        return this.sql`
            DELETE FROM ${this.sql(this.table_name)} WHERE year_joined < ${year};
        `;
    }

    public async findBySubject(subject_id: number) {
        return await this.sql`
            SELECT 
                STUDYING.*, 
                STUDENT.student_name 
            FROM ${this.sql(this.table_name)} AS STUDYING
            JOIN ${this.sql(students.table_name)} AS STUDENT
                ON STUDYING.student=STUDENT.id
            WHERE STUDYING.subject = ${subject_id}
        `;
    }

    public async autoInsertStudentsForSubject(
        subject_id: number, degree: string, _class: number, studying_year: number,
        coursework_grade_percent: number, finals_grade_percent: number
    ) {
        await this.sql`
            INSERT INTO ${this.sql(this.table_name)} 
                (student, subject, studying_year, coursework_grade_percent, finals_grade_percent)
            SELECT
                STUDENT.id,
                ${subject_id} AS subject,
                ${studying_year} AS studying_year,
                ${coursework_grade_percent} AS coursework_grade_percent,
                ${finals_grade_percent} AS finals_grade_percent
            FROM ${students.table_name} AS STUDENT
            WHERE STUDENT.degree = ${degree} AND STUDENT.class = ${_class}
        `;
    }

}



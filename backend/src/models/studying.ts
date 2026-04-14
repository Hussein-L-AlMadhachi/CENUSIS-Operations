import { PG_Table, type PG_App } from "pg-norm";
import { teaching_staff, subjects, students } from "../db.js";



export class Studying extends PG_Table {

    constructor(app: PG_App) {
        super(app, "studying", [
            "id", "teacher", "student", "subject", "exam_retakes",
            "semester_retakes", "studying_year", "hours_missed",
            "grade_fields", "is_attending_required", "is_submitted"
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

                    hours_missed                    INTEGER DEFAULT 0,
                    grade_fields                    JSONB NOT NULL DEFAULT '[]'::jsonb,

                    is_submitted                    BOOLEAN DEFAULT FALSE,

                    CHECK (hours_missed >= 0),

                    UNIQUE (student, subject),

                    FOREIGN KEY (student) REFERENCES ${sql(students.table_name)}(id) ON DELETE CASCADE,
                    FOREIGN KEY (subject) REFERENCES ${sql(subjects.table_name)}(id) ON DELETE CASCADE,
                    FOREIGN KEY (teacher) REFERENCES ${sql(teaching_staff.table_name)}(id) ON DELETE CASCADE
                )
            `;

            // Backward-compatible schema sync for pre-existing databases.
            await sql`
                ALTER TABLE ${sql(this.table_name)}
                ADD COLUMN IF NOT EXISTS exam_retakes INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS semester_retakes INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS is_attending_required BOOLEAN DEFAULT TRUE,
                ADD COLUMN IF NOT EXISTS grade_fields JSONB NOT NULL DEFAULT '[]'::jsonb
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

    public async setGradeFields(grade_fields: { name: string; grade: number }[], subject_id: number, student_id: number) {
        return await this.sql`
            UPDATE  ${this.sql(this.table_name)}
            SET grade_fields=${this.sql.json(grade_fields)} WHERE subject=${subject_id} AND student=${student_id}
        `;
    }

    public async getGradeFields(subject_id: number) {
        return await this.sql`
            SELECT
                STUDYING.id,
                STUDENT.student_name,
                SUBJECT.subject_name,
                TEACHER.teacher_name,
                STUDYING.grade_fields
            FROM studying AS STUDYING
            JOIN students AS STUDENT
                ON STUDYING.student=STUDENT.id
            JOIN subjects AS SUBJECT
                ON STUDYING.subject=SUBJECT.id
            JOIN teaching_staff AS TEACHER
                ON STUDYING.teacher=TEACHER.id
            WHERE STUDYING.subject = ${subject_id};
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

}



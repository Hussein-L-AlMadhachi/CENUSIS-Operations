import { PG_Table, type PG_App } from "pg-norm";
import { teaching_staff, subjects, students, studying } from "../../db.js";



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
            UPDATE  studying
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
            DELETE FROM studying WHERE year_joined < ${year};
        `;
    }

    public async findBySubject(subject_id: number) {
        return await this.sql`
            SELECT 
                STUDYING.*, 
                STUDENT.student_name,
                STUDENT.degree,
                STUDENT.class
            FROM studying AS STUDYING
            JOIN ${this.sql(students.table_name)} AS STUDENT
                ON STUDYING.student=STUDENT.id
            WHERE STUDYING.subject = ${subject_id}
        `;
    }

    public async bulkInsertBySubject(subject_id: number) {
        return await this.sql`
            INSERT INTO studying (teacher, student, subject, studying_year, hours_missed, grade_fields, is_submitted)
            SELECT 
                sub.teacher, 
                stu.id AS student, 
                sub.id AS subject, 
                EXTRACT(YEAR FROM CURRENT_DATE) AS studying_year, 
                0 AS hours_missed, 
                '[]'::jsonb AS grade_fields, 
                false AS is_submitted
            FROM subjects sub
            JOIN students stu ON sub.class = stu.class AND sub.degree = stu.degree
            WHERE sub.id = ${subject_id}
            AND NOT EXISTS (
                SELECT 1 
                FROM studying existing 
                WHERE existing.student = stu.id 
                AND existing.subject = sub.id
                AND existing.studying_year = EXTRACT(YEAR FROM CURRENT_DATE)
            );
        `;
    }

    public async getGradesByClassDegree(degree: string, class_number: number, grading_system: string) {
        return await this.sql`
            SELECT
                STUDENT.id AS student_id,
                STUDENT.student_name,
                SUBJECT.id AS subject_id,
                SUBJECT.subject_name,
                STUDYING.grade_fields
            FROM studying AS STUDYING
            JOIN students AS STUDENT ON STUDYING.student = STUDENT.id
            JOIN subjects AS SUBJECT ON STUDYING.subject = SUBJECT.id
            JOIN grading_systems AS gs ON SUBJECT.grading_system_id = gs.id
            WHERE STUDENT.degree = ${degree}
              AND STUDENT.class = ${class_number}
              AND SUBJECT.degree = ${degree}
              AND SUBJECT.class = ${class_number}
              AND SUBJECT.deleted_at IS NULL
              AND gs.name = ${grading_system}
            ORDER BY STUDENT.student_name, SUBJECT.subject_name
        `;
    }

    public async HardReset(){
        return await this.sql`
            delete from studying;
        `
    }

}



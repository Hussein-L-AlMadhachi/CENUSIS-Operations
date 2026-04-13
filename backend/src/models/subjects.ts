import { PG_Table, type PG_App } from "pg-norm";
import { students, studying } from "../db.js";



const columns2select = [
    "subjects.id", "subjects.subject_name", "subjects.subject_normalized_name", "subjects.teacher",
    "subjects.degree", "subjects.class", "subjects.hours_weekly",
    "subjects.is_attending_required", "subjects.semester", "teaching_staff.teacher_name"
];



export class Subjects extends PG_Table {

    constructor(app: PG_App) {
        super(app, "subjects", [
            "id", "subject_name", "subject_normalized_name", "teacher",
            "degree", "class", "hours_weekly",
            "is_attending_required", "semester"
        ]);
    }

    async create() {
        await this.sql.begin(async sql => {

            await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;

            await sql`
                CREATE TABLE IF NOT EXISTS ${sql(this.table_name)} (

                    id                          SERIAL PRIMARY KEY,
                    subject_name                VARCHAR(150) NOT NULL,
                    subject_normalized_name     VARCHAR(150) UNIQUE NOT NULL,

                    teacher                     INTEGER NOT NULL,

                    degree                      VARCHAR(150) NOT NULL,
                    class                       INTEGER NOT NULL,
                    hours_weekly                INTEGER NOT NULL,

                    is_attending_required       BOOLEAN DEFAULT FALSE,
                    semester                    INTEGER NOT NULL,

                    CHECK (semester BETWEEN 1 AND 2),
                    CHECK (class BETWEEN 1 AND 4),
                    CHECK (total_hours > 0),
                    CHECK (hours_weekly > 0 AND hours_weekly <= total_hours),

                    FOREIGN KEY (teacher) REFERENCES ${sql(this.table_name)}(id) ON DELETE CASCADE
                );
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS ${sql(`idx_${this.table_name}_normalized_name`)}
                    ON ${sql(this.table_name)} USING gist (subject_normalized_name gist_trgm_ops);
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS  ${sql(`idx_${this.table_name}_teacher`)}
                    ON ${sql(this.table_name)} (teacher);
            `;
        });
    }

    public async autocomplete(searched_name: string) {
        return await this.sql`
            SELECT subject_name, word_similarity(${searched_name}, subject_normalized_name) AS similarity
            FROM ${this.sql(this.table_name)}
            WHERE word_similarity(${searched_name}, subject_normalized_name) > 0.3 AND subject_normalized_name % ${searched_name}
            ORDER BY similarity DESC LIMIT 10;
        `;
    }

    public async autocompleteStudentsBySubject(searched_name: string, subject_id: number) {
        return await this.sql`
            SELECT STUDIER.student_name, word_similarity(${searched_name}, STUDIER.student_normalized_name) AS similarity
            FROM ${this.sql(students.table_name)} AS STUDIER
            JOIN ${this.sql(studying.table_name)} AS STUDYING ON STUDIER.id = STUDYING.student
            WHERE word_similarity(${searched_name}, STUDIER.student_normalized_name) > 0.3
            AND STUDYING.subject = ${subject_id}
            ORDER BY similarity DESC LIMIT 10;
        `;
    }

    async filterByYear(year: number) {
        return await this.sql`select ${this.sql(columns2select)} FROM subjects JOIN teaching_staff ON subjects.teacher = teaching_staff.id WHERE year=${year} order by subject_name`;
    }

    async listAll() {
        return await this.sql`select ${this.sql(columns2select)} FROM subjects JOIN teaching_staff ON subjects.teacher = teaching_staff.id order by subject_name`;
    }


    async filterByClassDegree(degree: string, class_id: number) {
        return await this.sql`select ${this.sql(columns2select)} FROM subjects JOIN teaching_staff ON subjects.teacher = teaching_staff.id WHERE degree=${degree} AND class=${class_id} order by subject_name`;
    }

    async filterByDegree(degree: string) {
        return await this.sql`select ${this.sql(columns2select)} FROM subjects JOIN teaching_staff ON subjects.teacher = teaching_staff.id WHERE degree=${degree} order by subject_name`;
    }

    async findByName(name: string) {
        return (await this.sql`select ${this.sql(columns2select)} FROM subjects JOIN teaching_staff ON subjects.teacher = teaching_staff.id WHERE subject_normalized_name=${name}`)[0];
    }

    async filterByTeacherClassDegree(teacher_id: number, degree: string, class_id: number) {
        return await this.sql`select ${this.sql(columns2select)} FROM subjects
            JOIN teaching_staff ON subjects.teacher = teaching_staff.id
            WHERE teacher=${teacher_id} AND degree=${degree} AND class=${class_id} order by subject_name`;
    }


    async filterByTeacherDegree(teacher_id: number, degree: string) {
        return await this.sql`select ${this.sql(columns2select)} FROM subjects
            JOIN teaching_staff ON subjects.teacher = teaching_staff.id
            WHERE teacher=${teacher_id} AND degree=${degree} order by subject_name`;
    }


}



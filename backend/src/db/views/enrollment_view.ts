import { PG_Table, type PG_App } from "pg-norm";
import { studying, subjects, teaching_staff, students } from "../../db.js";
import type postgres from "postgres";



export class EnrollmentView extends PG_Table {

    constructor(app: PG_App) {
        super(app, "enrollment_view", [
            "id", "created_at", "teacher_name", "subject_name", "degree", "class", "semester",
            "hours_missed", "coursework_grade", "coursework_grade_percent", "finals_grade_percent",
            "has_failed", "is_attending_required", "is_submitted", "teacher_id", "subject_id",
            "student_id", "student_name"]);
    }

    async create() {
        const Studying = this.sql(studying.table_name);
        const Subjects = this.sql(subjects.table_name);
        const TeachingStaff = this.sql(teaching_staff.table_name);
        const Students = this.sql(students.table_name);

        await this.sql`
            CREATE OR REPLACE VIEW ${this.sql(this.table_name)} AS
                SELECT 
                    ${Studying}.id,
                    ${Studying}.hours_missed,
                    ${Studying}.coursework_grade,
                    ${Studying}.coursework_grade_percent,
                    ${Studying}.finals_grade_percent,
                    ${Studying}.has_failed,
                    ${Studying}.is_submitted,

                    ${TeachingStaff}.teacher_name,
                    ${TeachingStaff}.id AS teacher_id,

                    ${Subjects}.subject_name,
                    ${Subjects}.id AS subject_id,
                    ${Subjects}.degree,
                    ${Subjects}.class,
                    ${Subjects}.semester,
                    ${Subjects}.is_attending_required,

                    ${Students}.id AS student_id,
                    ${Students}.student_name

                FROM ${Studying}
                JOIN ${Students} ON ${Studying}.student = ${Students}.id
                JOIN ${Subjects} ON ${Studying}.subject = ${Subjects}.id
                JOIN ${TeachingStaff} ON ${Studying}.teacher = ${TeachingStaff}.id;
        `;
    }

    async findBySubject(subject_id: number): Promise<postgres.RowList<postgres.Row[]>> {
        const result = await this.sql`
            SELECT * FROM ${this.sql(this.table_name)}
            WHERE ${this.sql("subject_id")} = ${subject_id}
        `;
        return result;
    }
}



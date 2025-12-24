import { PG_Table, type PG_App } from "pg-norm";
import { studying, attendance_record, subjects, teaching_staff, students, absented } from "../../db.js";
import type postgres from "postgres";



export class AttendanceRecordView extends PG_Table {

    constructor(app: PG_App) {
        super(app, "attendance_record_view", [
            "id", "created_at", "teacher_name", "subject_name", "degree", "class", "semester",
            "day", "month", "year", "student_name", "hours_absent"
        ]);
    }

    async create() {
        const AttendanceRecord = this.sql(attendance_record.table_name);
        const TeachingStaff = this.sql(teaching_staff.table_name);
        const Studying = this.sql(studying.table_name);
        const Subjects = this.sql(subjects.table_name);
        const Students = this.sql(students.table_name);
        const Absented = this.sql(absented.table_name);

        await this.sql`
            CREATE OR REPLACE VIEW ${this.sql(this.table_name)} AS
                SELECT 
                    ${AttendanceRecord}.id,
                    ${AttendanceRecord}.created_at,
                    ${AttendanceRecord}.date,
                    ${TeachingStaff}.teacher_name,
                    ${Subjects}.subject_name,
                    ${Subjects}.id as subject_id,
                    ${Subjects}.degree,
                    ${Subjects}.class,
                    ${Subjects}.semester,
                    ${Students}.student_name,
                    ${Absented}.hours_absent
                FROM ${AttendanceRecord}
                JOIN ${Studying} ON ${AttendanceRecord}.subject = ${Studying}.id
                JOIN ${Subjects} ON ${Studying}.subject = ${Subjects}.id
                JOIN ${TeachingStaff} ON ${Studying}.teacher = ${TeachingStaff}.id
                JOIN ${Students} ON ${Studying}.student = ${Students}.id
                JOIN ${Absented} ON ${AttendanceRecord}.id = ${Absented}.attendance_record;
        `;
    }

    async findBySubject(subject_id: number): Promise<postgres.RowList<postgres.Row[]>> {
        const result = await this.sql`
            SELECT * FROM ${this.sql(this.table_name)}
            WHERE ${this.sql("subject_id")} = ${subject_id}
            ORDER BY year DESC, month DESC, day DESC, student_name ASC
        `;
        return result;
    }
}

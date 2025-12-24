import { PG_Table } from "pg-norm";
import { studying, absented, students, subjects, attendance_record, teaching_staff } from "../../db.js";
export class StudentAbsenceView extends PG_Table {
    constructor(app) {
        super(app, "students_absence_view", [
            "id", "student_name", "subject_name", "teacher_name", "hours_absent", "created_at"
        ]);
    }
    async create() {
        const Studying = this.sql(studying.table_name);
        const Students = this.sql(students.table_name);
        const Absented = this.sql(absented.table_name);
        const Attendance = this.sql(attendance_record.table_name);
        const Subjects = this.sql(subjects.table_name);
        const TeachingStaff = this.sql(teaching_staff.table_name);
        await this.sql `
            CREATE OR REPLACE VIEW ${this.sql(this.table_name)} AS

            SELECT
                ${Attendance}.id as id,
                ${Attendance}.day as day,
                ${Attendance}.month as month,
                ${Attendance}.year as year,
                ${Students}.student_name as student_name,
                ${Subjects}.subject_name as subject_name,
                ${TeachingStaff}.teacher_name as teacher_name,
                ${Absented}.hours_absent as hours_absent,
                ${Attendance}.created_at as created_at
            FROM ${Attendance}

            INNER JOIN ${Absented} ON ${Attendance}.id = ${Absented}.attendance_record
            INNER JOIN ${Studying} ON ${Attendance}.studying = ${Studying}.id
            INNER JOIN ${Students} ON ${Studying}.student = ${Students}.id
            INNER JOIN ${Subjects} ON ${Studying}.subject = ${Subjects}.id
            INNER JOIN ${TeachingStaff} ON ${Studying}.teacher = ${TeachingStaff}.id;
        `;
    }
    async addAbsence(student_id, attendance_record_id, hours_absent) {
        // will need these later
        const Studying = this.sql(studying.table_name);
        const Absented = this.sql(absented.table_name);
        return await this.sql.begin(async (sql) => {
            // Enforce the strictest isolation level
            await sql `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;
            await sql `
                INSERT INTO ${Absented} (student, attendance_record, hours_absent)
                VALUES (${student_id}, ${attendance_record_id}, ${hours_absent});
            `;
            await sql `
                UPDATE ${Studying} SET hours_missed = hours_missed + ${hours_absent}
                WHERE
                student = ${student_id};
            `;
        });
    }
}
//# sourceMappingURL=students_absence_view.js.map
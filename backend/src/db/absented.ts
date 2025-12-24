import { PG_Table, type PG_App } from "pg-norm";
import { students, attendance_record, studying } from "../db.js";



export class Absented extends PG_Table {

    constructor(app: PG_App) {
        super(app, "absented", [
            "id", "attendance_record", "student", "hours_absent"]);
    }

    async create() {
        await this.sql`        
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                  SERIAL PRIMARY KEY,
                attendance_record   INTEGER NOT NULL,
                student             INTEGER NOT NULL,
                hours_absent        INTEGER NOT NULL,

                FOREIGN KEY (attendance_record) REFERENCES ${this.sql(attendance_record.table_name)}(id) ON DELETE CASCADE,
                FOREIGN KEY (student) REFERENCES ${this.sql(students.table_name)}(id) ON DELETE CASCADE
            );
        `;
    }

    async findByAttendanceRecord(attendance_record_id: number) {
        return await this.sql`
            SELECT ABS.id, ABS.hours_absent, STU.student_name
            FROM ${this.sql(this.table_name)} AS ABS
            JOIN ${this.sql(students.table_name)} AS STU
                ON ABS.student = STU.id
            WHERE ABS.attendance_record = ${attendance_record_id}
        `;
    }

    async markAbsent(student_id: number, attendance_record_id: number, hours_absent: number) {
        this.sql.begin(async sql => {
            // Enforce the strictest isolation level (first statement in transaction)
            await sql`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

            // Check if the student is already absent for this attendance record
            const [existingAbsence] = await sql`
                SELECT * FROM ${this.sql(this.table_name)}
                WHERE student = ${student_id}
                AND attendance_record = ${attendance_record_id}
            `;

            if (existingAbsence) {
                return;
            }

            // Insert the absence record
            await sql`
                INSERT INTO ${this.sql(this.table_name)} (student, attendance_record, hours_absent)
                VALUES (${student_id}, ${attendance_record_id}, ${hours_absent})
            `;

            // Update the hours_missed in studying
            await sql`
                UPDATE ${this.sql(studying.table_name)} 
                SET hours_missed = hours_missed + ${hours_absent}
                WHERE student = ${student_id}
            `;
        });
    }


    async removeAbsence(absented_id: number) {

        this.sql.begin(async sql => {
            // Enforce the strictest isolation level
            await sql`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

            // First, get the hours_absent value from the record to be deleted
            const [result] = await sql`
                SELECT hours_absent, student 
                FROM ${this.sql(this.table_name)} 
                WHERE id = ${absented_id}
            `;

            // If no record found, exit or handle error
            if (!result) {
                throw new Error('Absented record not found');
            }

            // Delete the absence record
            await sql`
                DELETE FROM ${this.sql(this.table_name)} 
                WHERE id = ${absented_id};
            `;

            // Subtract the absent hours from studying.hours_missed
            await sql`
                UPDATE ${this.sql(studying.table_name)} 
                SET hours_missed = hours_missed - ${result.hours_absent}
                WHERE student = ${result.student};
            `;
        });
    }
}

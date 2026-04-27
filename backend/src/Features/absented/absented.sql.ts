import { PG_Table, type PG_App } from "pg-norm";
import { students, attendance_record, studying } from "../../db.js";



export class Absented extends PG_Table {

    constructor(app: PG_App) {
        super(app, "absented", [
            "id", "attendance_record", "student", "hours_absent"]);
    }

    async create() {
        await this.sql`        
            CREATE TABLE IF NOT EXISTS absented (
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
            SELECT DISTINCT 
                std.id AS id,
                std.id AS student_id,
                std.student_name,
                COALESCE(abse.hours_absent, 0) AS hours_absent
            FROM students std
            JOIN studying sub ON sub.student = std.id
            JOIN attendance_record att ON att.subject = sub.subject
            LEFT JOIN absented abse ON abse.student = std.id
                AND abse.attendance_record = att.id
            WHERE att.id=${attendance_record_id}
        `;
    }

    async markAbsent(student_id: number, attendance_record_id: number, hours_absent: number) {
        await this.sql.begin(async sql => {
            await sql`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

            const [existingAbsence] = await sql`
                SELECT hours_absent
                FROM absented
                WHERE student = ${student_id}
                AND attendance_record = ${attendance_record_id}
            `;

            if (existingAbsence) {
                await sql`
                    UPDATE absented
                    SET hours_absent = ${hours_absent}
                    WHERE student = ${student_id}
                    AND attendance_record = ${attendance_record_id}
                `;

                const delta = hours_absent - existingAbsence.hours_absent;
                if (delta !== 0) {
                    await sql`
                        UPDATE ${this.sql(studying.table_name)}
                        SET hours_missed = hours_missed + ${delta}
                        WHERE student = ${student_id}
                        AND subject = (
                            SELECT subject
                            FROM ${this.sql(attendance_record.table_name)}
                            WHERE id = ${attendance_record_id}
                        )
                    `;
                }
                return;
            }

            await sql`
                INSERT INTO absented (student, attendance_record, hours_absent)
                VALUES (${student_id}, ${attendance_record_id}, ${hours_absent})
            `;

            await sql`
                UPDATE ${this.sql(studying.table_name)} 
                SET hours_missed = hours_missed + ${hours_absent}
                WHERE student = ${student_id}
                AND subject = (
                    SELECT subject
                    FROM ${this.sql(attendance_record.table_name)}
                    WHERE id = ${attendance_record_id}
                )
            `;
        });
    }


    async removeAbsence(absented_id: number) {

        await this.sql.begin(async sql => {
            // Enforce the strictest isolation level
            await sql`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

            // First, get the hours_absent value from the record to be deleted
            const [result] = await sql`
                SELECT hours_absent, student, attendance_record 
                FROM absented 
                WHERE id = ${absented_id}
            `;

            // If no record found, exit or handle error
            if (!result) {
                throw new Error('Absented record not found');
            }

            // Delete the absence record
            await sql`
                DELETE FROM absented 
                WHERE id = ${absented_id};
            `;

            // Subtract the absent hours from studying.hours_missed
            await sql`
                UPDATE ${this.sql(studying.table_name)} 
                SET hours_missed = hours_missed - ${result.hours_absent}
                WHERE student = ${result.student}
                AND subject = (
                    SELECT subject
                    FROM ${this.sql(attendance_record.table_name)}
                    WHERE id = ${result.attendance_record}
                );
            `;
        });
    }

    async updateAbsence(absented_id: number, hours_absent: number) {
        await this.sql.begin(async sql => {
            await sql`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

            const [result] = await sql`
                SELECT hours_absent, student, attendance_record
                FROM absented
                WHERE id = ${absented_id}
            `;

            if (!result) {
                throw new Error("Absented record not found");
            }

            await sql`
                UPDATE absented
                SET hours_absent = ${hours_absent}
                WHERE id = ${absented_id}
            `;

            const delta = hours_absent - result.hours_absent;
            if (delta !== 0) {
                await sql`
                    UPDATE studying
                    SET hours_missed = hours_missed + ${delta}
                    WHERE student = ${result.student}
                    AND subject = (
                        SELECT subject
                        FROM attendance_record
                        WHERE id = ${result.attendance_record}
                    )
                `;
            }
        });
    }
}

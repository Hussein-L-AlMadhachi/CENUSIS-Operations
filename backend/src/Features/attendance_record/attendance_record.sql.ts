import { PG_Table, type PG_App } from "pg-norm";
import { subjects } from "../../db.js";



export class AttendanceRecord extends PG_Table {

    constructor(app: PG_App) {
        super(app, "attendance_record", [
            "id", "subject", "date", "created_at"]);
    }

    async create() {
        await this.sql`        
            CREATE TABLE IF NOT EXISTS attendance_record (
                id                    SERIAL PRIMARY KEY,

                subject               INTEGER NOT NULL,
                date                  VARCHAR(10) NOT NULL,
                lab_attendance        BOOLEAN DEFAULT FALSE,

                created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (subject) REFERENCES ${this.sql(subjects.table_name)}(id) ON DELETE CASCADE
            );
        `;
    }

    async findBySubject(subject_id: number) {
        return await this.sql`select ${this.sql(this.visibles)} from attendance_record where subject=${subject_id};`;
    }

    async findByLabSubject(subject_id: number) {
        return await this.sql`select ${this.sql(this.visibles)} from attendance_record where subject=${subject_id} AND lab_attendance = TRUE;`;
    }

    async delete(attendance_record_id: number) {
        return await this.sql`delete from attendance_record where id=${attendance_record_id}`;
    }

}

import { PG_Table, type PG_App } from "pg-norm";
import { subjects } from "../db.js";
import type postgres from "postgres";


export class AttendanceRecord extends PG_Table {

    constructor(app: PG_App) {
        super(app, "attendance_record", [
            "id", "subject", "date", "created_at"]);
    }

    async create() {
        await this.sql`        
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                    SERIAL PRIMARY KEY,

                subject               INTEGER NOT NULL,
                date                  VARCHAR(10) NOT NULL,

                created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (subject) REFERENCES ${this.sql(subjects.table_name)}(id) ON DELETE CASCADE
            );
        `;
    }

    async findBySubject(subject_id: number) {
        return await this.sql`select ${this.sql(this.visibles)} from ${this.sql(this.table_name)} where subject=${subject_id}`;
    }

    async delete(attendance_record_id: number) {
        return await this.sql`delete from ${this.sql(this.table_name)} where id=${attendance_record_id}`;
    }

}

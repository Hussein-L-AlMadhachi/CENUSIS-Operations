import { PG_Table } from "pg-norm";
import { studying, absented, students, subjects } from "../db.js";
export class AttendanceRecord extends PG_Table {
    constructor(app) {
        super(app, "attendance_record", [
            "id", "studying", "created_at"
        ]);
    }
    async create() {
        await this.sql `        
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                    SERIAL PRIMARY KEY,
                studying              INTEGER NOT NULL,
                created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (studying) REFERENCES ${this.sql(studying.table_name)}(id)
            );
        `;
    }
}
//# sourceMappingURL=attendance.js.map
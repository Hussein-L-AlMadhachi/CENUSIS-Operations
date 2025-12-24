import { PG_Table } from "pg-norm";
import { loggedin_users } from "../db.js";
export class TeachingStaff extends PG_Table {
    constructor(app) {
        super(app, "teaching_staff", [
            "id", "name", "normalized_name",
            "availability_bitmap", "hours_available"
        ]);
    }
    /** NOTE: availability_bitmap is used for automatic time table generation */
    async create() {
        await this.sql.begin(async (tx) => {
            await tx `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;
            await tx `CREATE EXTENSION IF NOT EXISTS pg_trgm`;
            await tx `
                CREATE TABLE IF NOT EXISTS ${tx(this.table_name)} (
                    id                    SERIAL PRIMARY KEY,
                    name                  VARCHAR(150) NOT NULL,
                    normalized_name       VARCHAR(150) UNIQUE NOT NULL,
                    availability_bitmap   BIGINT DEFAULT 0,
                    hours_available       INTEGER DEFAULT 0,
                    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            await tx `
                CREATE INDEX IF NOT EXISTS teaching_staff_name_trgm_idx 
                ON ${tx(this.table_name)} 
                USING GIST (normalized_name gist_trgm_ops)
            `;
        });
    }
    async autocomplete(searched_name) {
        return await this.sql `
            SELECT name, word_similarity(${searched_name}, normalized_name) AS score
            FROM ${this.sql(this.table_name)} 
            WHERE ${searched_name} <% normalized_name
            ORDER BY score DESC
            LIMIT 10;
        `;
    }
    async findByName(normalized_name) {
        return await this.sql `
            SELECT * FROM ${this.sql(this.table_name)} WHERE normalized_name = ${normalized_name};
        `;
    }
}
//# sourceMappingURL=teaching_staff.js.map
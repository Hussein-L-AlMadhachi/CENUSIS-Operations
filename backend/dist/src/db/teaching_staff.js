import { PG_Table } from "pg-norm";
import { loggedin_users } from "../db.js";
export class TeachingStaff extends PG_Table {
    constructor(app) {
        super(app, "teaching_staff", [
            "id", "teacher_name", "teacher_normalized_name",
            "availability_bitmap", "hours_available", "login_credentials", "registered_at"
        ]);
    }
    /** NOTE: availability_bitmap is used for automatic time table generation */
    async create() {
        await this.sql.begin(async (sql) => {
            await sql `CREATE EXTENSION IF NOT EXISTS pg_trgm`;
            await sql `
                CREATE TABLE IF NOT EXISTS ${sql(this.table_name)} (
                    id                              SERIAL PRIMARY KEY,
                    teacher_name                    VARCHAR(150) NOT NULL,
                    teacher_normalized_name         VARCHAR(150) UNIQUE NOT NULL,

                    login_credentials               INTEGER NOT NULL,

                    availability_bitmap             BIGINT DEFAULT 0,
                    hours_available                 INTEGER DEFAULT 0,

                    registered_at                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                    CHECK(hours_available >= 0),
                    FOREIGN KEY (login_credentials) REFERENCES ${sql(loggedin_users.table_name)}(id)
                )
            `;
            await sql `
                CREATE INDEX IF NOT EXISTS ${sql(`idx_${this.table_name}_normalized_name`)}
                    ON ${sql(this.table_name)} USING gist (teacher_normalized_name gist_trgm_ops);
            `;
            await sql `
                CREATE INDEX IF NOT EXISTS  ${sql(`idx_${this.table_name}_normalized_name`)}
                    ON ${sql(this.table_name)} (login_credentials);
            `;
        });
    }
    async autocomplete(searched_name) {
        return await this.sql `
            SELECT teacher_name, word_similarity(${searched_name}, teacher_normalized_name) AS similarity
            FROM ${this.sql(this.table_name)}
            WHERE word_similarity(${searched_name}, teacher_normalized_name) > 0.3
            ORDER BY similarity DESC LIMIT 10;
        `;
    }
    async findByName(normalized_name) {
        return (await this.sql `
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} WHERE teacher_normalized_name = ${normalized_name};
        `)[0];
    }
    async fetchByUserId(user_id) {
        return (await this.sql `
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} WHERE login_credentials = ${user_id};
        `)[0];
    }
}
//# sourceMappingURL=teaching_staff.js.map
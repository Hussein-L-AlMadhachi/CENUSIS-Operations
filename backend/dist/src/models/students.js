import { PG_Table } from "pg-norm";
export class StudentsTable extends PG_Table {
    constructor(app) {
        super(app, "students_table", [
            "id", "name", "normalized_name", "joined_year", "class",
            "years_retaken", "years_failed", "courses_failed"
        ]);
    }
    async create() {
        await this.sql.begin(async (tx) => {
            // Enforce the strictest isolation level (first statement in transaction)
            await tx `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;
            // Create extension (safe to run in transaction)
            await tx `CREATE EXTENSION IF NOT EXISTS pg_trgm`;
            // Create table
            await tx `
                CREATE TABLE IF NOT EXISTS ${tx(this.table_name)} (
                    id                  SERIAL PRIMARY KEY,
                    name                VARCHAR(150) NOT NULL,
                    normalized_name     VARCHAR(150) UNIQUE NOT NULL,
                    joined_year         INTEGER NOT NULL,
                    degree              VARCHAR(20) NOT NULL,
                    class               INTEGER NOT NULL,
                    years_retaken       INTEGER DEFAULT 0,
                    years_failed        INTEGER DEFAULT 0,
                    courses_failed      INTEGER DEFAULT 0
                )
            `;
            // Create trigram index
            await tx `
                CREATE INDEX IF NOT EXISTS ${tx(`${this.table_name}_name_trgm_idx`)}
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
//# sourceMappingURL=students.js.map
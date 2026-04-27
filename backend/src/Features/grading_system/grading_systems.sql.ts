import { PG_Table, type PG_App } from "pg-norm";

export class GradingSystems extends PG_Table {

    constructor(app: PG_App) {
        super(app, "grading_systems", [
            "id", "name", "normalized_name", "fields"
        ]);
    }

    async create() {
        await this.sql.begin(async sql => {
            await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;

            await sql`
                CREATE TABLE IF NOT EXISTS grading_systems (
                    id                  SERIAL PRIMARY KEY,
                    name                VARCHAR(150) NOT NULL,
                    normalized_name     VARCHAR(150) UNIQUE NOT NULL,
                    fields              JSONB NOT NULL DEFAULT '[]'::jsonb
                )
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS ${sql(`idx_grading_systems_normalized_name`)}
                    ON grading_systems USING gist (normalized_name gist_trgm_ops)
            `;
        });
    }

    public async autocomplete(searched_name: string) {
        return await this.sql`
            SELECT name, word_similarity(${searched_name}, normalized_name) AS similarity
            FROM grading_systems
            WHERE word_similarity(${searched_name}, normalized_name) > 0.3 AND normalized_name % ${searched_name}
            ORDER BY similarity DESC LIMIT 10;
        `;
    }

    public async findByName(normalized_name: string) {
        return (await this.sql`
            SELECT ${this.sql(this.visibles)} FROM grading_systems WHERE normalized_name = ${normalized_name};
        `)[0];
    }


    public async listAll() {
        return await this.sql`
            SELECT ${this.sql(this.visibles)} FROM grading_systems ORDER BY name ASC;
        `;
    }
}
import { PG_Table } from "pg-norm";
import { normalize_arabic } from "../helpers/normalize_arabic.js";
export class StudentsTable extends PG_Table {
    constructor(app) {
        super(app, "students", [
            "id", "student_name", "student_normalized_name", "joined_year",
            "degree", "class", "sex", "years_retaken", "years_failed"
        ]);
    }
    async create() {
        await this.sql.begin(async (sql) => {
            // Create extension (safe to run in transaction)
            await sql `CREATE EXTENSION IF NOT EXISTS pg_trgm`;
            // Create table
            await sql `
                CREATE TABLE IF NOT EXISTS ${sql(this.table_name)} (
                    id                          SERIAL PRIMARY KEY,

                    student_name                        VARCHAR(150) NOT NULL,
                    student_normalized_name     VARCHAR(150) UNIQUE NOT NULL,
                    joined_year                 INTEGER NOT NULL,

                    degree                      VARCHAR(20) NOT NULL,
                    class                       INTEGER NOT NULL,

                    years_retaken               INTEGER DEFAULT 0,
                    years_failed                INTEGER DEFAULT 0

                )
            `;
            await sql `
                CREATE INDEX IF NOT EXISTS ${sql(`idx_${this.table_name}_normalized_name`)}
                    ON ${sql(this.table_name)} USING gist (student_normalized_name gist_trgm_ops);
            `;
        });
    }
    async autocomplete(searched_name) {
        return await this.sql `
            SELECT student_name, word_similarity(${searched_name}, student_normalized_name) AS similarity
            FROM ${this.sql(this.table_name)}
            ORDER BY similarity DESC LIMIT 10;
        `;
    }
    listAll() {
        return this.sql `
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} ORDER BY student_name ASC;
        `;
    }
    async importData(data) {
        const validatedData = data.map(item => ({
            student_name: String(item.student_name || ''),
            student_normalized_name: normalize_arabic(item.student_name),
            joined_year: Number(item.joined_year) || new Date().getFullYear(),
            degree: String(item.degree || ''),
            class: Number(item.class) || 1,
            sex: String(item.sex || ''),
            years_retaken: Number(item.years_retaken) || 0,
            years_failed: Number(item.years_failed) || 0
        }));
        // Batch insert for better performance with large datasets
        const batchSize = 100;
        for (let i = 0; i < validatedData.length; i += batchSize) {
            const batch = validatedData.slice(i, i + batchSize);
            await this.sql `
                INSERT INTO ${this.sql(this.table_name)} ${this.sql(batch)}
                ON CONFLICT (student_normalized_name) DO UPDATE SET
                    student_name = EXCLUDED.student_name,
                    student_normalized_name = EXCLUDED.student_normalized_name,
                    joined_year = EXCLUDED.joined_year,
                    degree = EXCLUDED.degree,
                    class = EXCLUDED.class,
                    sex = EXCLUDED.sex,
                    years_retaken = EXCLUDED.years_retaken,
                    years_failed = EXCLUDED.years_failed
            `;
        }
    }
    async findByName(student_normalized_name) {
        return (await this.sql `
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} WHERE student_normalized_name = ${student_normalized_name};
        `)[0];
    }
    async filterStudentsByClassDegree(degree, student_class) {
        return await this.sql `
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} WHERE degree = ${degree} AND class = ${student_class};
        `;
    }
    async filterStudentsByDegree(degree) {
        return await this.sql `
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} WHERE degree = ${degree};
        `;
    }
}
//# sourceMappingURL=students.js.map
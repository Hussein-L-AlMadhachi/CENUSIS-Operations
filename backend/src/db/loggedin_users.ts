import { PG_AuthTable, type PG_App } from "pg-norm";



export class LoggedinUsers extends PG_AuthTable {

    constructor(app: PG_App) {
        super(
            app, "loggedin_users",
            [
                "id", "username", "normalized_username",
                "role"
            ]
            , "normalized_username"
        );
    }

    async create() {
        await this.sql`
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                     SERIAL PRIMARY KEY,
                username               VARCHAR(100) NOT NULL,
                normalized_username     VARCHAR(150) UNIQUE NOT NULL,
                ${this.sql(this.passwordField)}  VARCHAR(100) NOT NULL,
                role                   VARCHAR(20) NOT NULL
            );
        `;
    }

    async findByUserName(normalized_username: string) {
        return (await this.sql`
            SELECT
                ${this.sql(this.visibles)}
            FROM ${this.sql(this.table_name)}
            WHERE normalized_username = ${normalized_username};
        `)[0];
    }
}

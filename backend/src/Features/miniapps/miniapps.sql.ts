import { PG_AuthTable, type PG_App } from "pg-norm";





export class MiniAppsTable extends PG_AuthTable {


    constructor(app: PG_App) {
        super(app, "miniapps", 
            [
                "id", "miniapp_name",
                "miniapp_author","miniapp_homepage","miniapp_icon"
            ],
            "miniapp_code"
        );
    }


    async create() {
        const sql = this.sql;

        await sql`
            CREATE TABLE IF NOT EXISTS ${sql(this.table_name)} (
                id                            INTEGER SERIAL PRIMARY KEY,
                miniapp_name                  VARCHAR(200) NOT NULL,
                miniapp_author                VARCHAR(200) NOT NULL,
                miniapp_homepage              VARCHAR(1024) NOT NULL,
                miniapp_icons                 TEXT UNIQUE DEFAULT NULL
            )
        `;
    }


}



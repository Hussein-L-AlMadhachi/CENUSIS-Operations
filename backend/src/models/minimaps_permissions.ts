import { PG_Table, type PG_App } from "pg-norm";
import { miniapps } from "../db.js";





export class MiniAppPermissionsTable extends PG_Table {


    constructor(app: PG_App) {
        super (
            app, "miniapp_permissions", 
            [
                "id","granted_minimapp", "granted_action"
            ]
        );
    }


    async create() {
        const sql = this.sql;

        await sql`
            CREATE TABLE IF NOT EXISTS ${sql(this.table_name)} (
                id                            SERIAL PRIMARY KEY,
                granted_minimapp                   INTEGER NOT NULL,
                granted_action               VARCHAR(100) NOT NULL,

                FOREIGN KEY (granted_minimapp) REFERENCES ${sql(miniapps.table_name)}(id) ON DELETE CASCADE,
            )
        `;
    }


}

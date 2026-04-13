import { PG_Table, type PG_App } from "pg-norm";
import { studying, absented, students, subjects, loggedin_users } from "../db.js";
import type postgres from "postgres";


export class ActivityLogs extends PG_Table {

    constructor(app: PG_App) {
        super(
            app, "activity_logs",
            [
                "id", "user_id", "username",
                "role", "activity", "useragent", "ip", "created_at"
            ]
        );
    }

    async create() {
        await this.sql`
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                     SERIAL PRIMARY KEY,
                user_id                INTEGER NOT NULL,
                username               VARCHAR(100) NOT NULL,
                role                   VARCHAR(20) NOT NULL,
                activity               TEXT NOT NULL,
                useragent              TEXT NOT NULL,
                ip                     VARCHAR(15) NOT NULL,

                created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES ${this.sql(loggedin_users.table_name)}(id) ON DELETE CASCADE
            );
        `;

        await this.sql`
            CREATE INDEX IF NOT EXISTS idx_logs_user_id
                ON ${this.sql(this.table_name)} (user_id);
        `;
    }

    async log(user_id: number, username: string, role: string, activity: string, useragent: string, ip: string) {
        return await this.sql`
            INSERT INTO ${this.sql(this.table_name)} (user_id, username, role, activity, useragent, ip)
            VALUES (${user_id}, ${username}, ${role}, ${activity}, ${useragent}, ${ip});
        `;
    }

    async fetchUserLogs(row_id: number): Promise<import("postgres").RowList<import("postgres").Row[]>> {
        return await this.sql`
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} WHERE user_id = ${row_id};
        `;
    }

    async fetchAllLogs(): Promise<import("postgres").RowList<import("postgres").Row[]>> {
        return await this.sql`
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)};
        `;
    }

    async fetchUserLogsByRole(row_id: number, role: string): Promise<import("postgres").RowList<import("postgres").Row[]>> {
        return await this.sql`
            SELECT ${this.sql(this.visibles)} FROM ${this.sql(this.table_name)} WHERE user_id = ${row_id} AND role = ${role};
        `;
    }
}


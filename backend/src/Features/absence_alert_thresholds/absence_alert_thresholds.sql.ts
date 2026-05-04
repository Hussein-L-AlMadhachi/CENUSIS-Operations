import { PG_Table, type PG_App } from "pg-norm";


export class AbsenceAlertThresholds extends PG_Table {
    constructor(app: PG_App) {
        super(app, "absence_alert_thresholds", [
            "id", "grading_system_id", "alert_name", "threshold_percent"
        ]);
    }

    async create() {
        await this.sql.begin(async sql => {
            await sql`
                CREATE TABLE IF NOT EXISTS absence_alert_thresholds (
                    id                  SERIAL PRIMARY KEY,
                    grading_system_id   INTEGER NOT NULL,
                    alert_name          VARCHAR(150) NOT NULL,
                    threshold_percent   NUMERIC(5,2) NOT NULL,

                    CONSTRAINT absence_alert_thresholds_percent_check
                        CHECK (threshold_percent >= 0 AND threshold_percent <= 100),
                    CONSTRAINT absence_alert_thresholds_unique_name
                        UNIQUE (grading_system_id, alert_name),

                    FOREIGN KEY (grading_system_id) REFERENCES grading_systems(id) ON DELETE CASCADE
                )
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS ${sql("idx_absence_alert_thresholds_grading_system_id")}
                    ON absence_alert_thresholds (grading_system_id)
            `;
        });
    }

    async listAllWithGradingSystemName(grading_system_name?: string) {
        if (grading_system_name && grading_system_name.trim() !== "") {
            return await this.sql`
                SELECT
                    t.id,
                    t.grading_system_id,
                    gs.name AS grading_system_name,
                    t.alert_name,
                    t.threshold_percent
                FROM absence_alert_thresholds AS t
                JOIN grading_systems AS gs ON gs.id = t.grading_system_id
                WHERE gs.name = ${grading_system_name.trim()}
                ORDER BY t.threshold_percent ASC, t.threshold_percent ASC, t.alert_name ASC
            `;
        }

        return await this.sql`
            SELECT
                t.id,
                t.grading_system_id,
                gs.name AS grading_system_name,
                t.alert_name,
                t.threshold_percent
            FROM absence_alert_thresholds AS t
            JOIN grading_systems AS gs ON gs.id = t.grading_system_id
            ORDER BY gs.name ASC, t.threshold_percent ASC, t.alert_name ASC
        `;
    }
}


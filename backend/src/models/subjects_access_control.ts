import { PG_Table, type PG_App } from "pg-norm";
import { subjects, loggedin_users, teaching_staff } from "../db.js";



export class SubjectsAccessControl extends PG_Table {

    constructor(app: PG_App) {
        super(app, "subjects_access_control", [
            "id", "subject", "loggedin_user", "does_fill_attendance", "does_fill_grades", "is_original_owner"]);
    }

    async create() {
        await this.sql`
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id                      SERIAL PRIMARY KEY,

                subject                 INTEGER NOT NULL,
                loggedin_user           INTEGER NOT NULL,

                does_fill_attendance    BOOLEAN NOT NULL,
                does_fill_grades        BOOLEAN NOT NULL,
                is_original_owner       BOOLEAN DEFAULT FALSE,

                FOREIGN KEY (subject) REFERENCES ${this.sql(subjects.table_name)}(id) ON DELETE CASCADE,
                FOREIGN KEY (loggedin_user) REFERENCES ${this.sql(loggedin_users.table_name)}(id) ON DELETE CASCADE
            );
        `;

        await this.sql`
            CREATE INDEX IF NOT EXISTS ${this.sql(`idx_${this.table_name}_subject_user`)}
            ON ${this.sql(this.table_name)} (subject, loggedin_user);
        `;
    }

    async is_auth(subject_id: number, user_id: number) {
        return await this.sql`
            SELECT * FROM ${this.sql(this.table_name)} 
            WHERE subject = ${subject_id} AND loggedin_user = ${user_id}
        `;
    }

    async is_owner(subject_id: number, user_id: number) {
        return await this.sql`
            SELECT * FROM ${this.sql(this.table_name)} 
            WHERE subject = ${subject_id} AND loggedin_user = ${user_id} AND is_original_owner = TRUE
        `;
    }

    async revoke(subject_id: number, user_id: number) {
        return await this.sql`
            DELETE FROM ${this.sql(this.table_name)} 
            WHERE subject = ${subject_id} AND loggedin_user = ${user_id} AND is_original_owner = FALSE;
        `;
    }

    async grant(subject_id: number, user_id: number) {
        return await this.sql`
            INSERT INTO ${this.sql(this.table_name)} (subject, loggedin_user, does_fill_attendance, does_fill_grades, is_original_owner)
            VALUES (${subject_id}, ${user_id}, TRUE, TRUE, FALSE);
        `;
    }

    async create_original_owner(subject_id: number, user_id: number) {
        return await this.sql`
            INSERT INTO ${this.sql(this.table_name)} (subject, loggedin_user, does_fill_attendance, does_fill_grades, is_original_owner)
            VALUES (${subject_id}, ${user_id}, TRUE, TRUE, TRUE);
        `;
    }

    async fetchForUser(user_id: number) {
        return await this.sql`
            SELECT AC.id, AC.subject, AC.loggedin_user, AC.does_fill_attendance, AC.does_fill_grades, AC.is_original_owner, 
                USERS.username AS user_name, USERS.role AS user_role, SUBJ.subject_name AS subject_name
            FROM ${this.sql(this.table_name)} AS AC
            JOIN ${this.sql(loggedin_users.table_name)} AS USERS ON AC.loggedin_user = USERS.id
            JOIN ${this.sql(subjects.table_name)} AS SUBJ ON AC.subject = SUBJ.id
            WHERE AC.loggedin_user = ${user_id};
        `;
    }

    async fetchForSubject(subject_id: number) {
        return await this.sql`
            SELECT AC.id, AC.subject, AC.loggedin_user, AC.does_fill_attendance, AC.does_fill_grades, AC.is_original_owner, 
                USERS.username AS user_name, USERS.role AS user_role, SUBJ.subject_name AS subject_name
            FROM ${this.sql(this.table_name)} AS AC
            JOIN ${this.sql(loggedin_users.table_name)} AS USERS ON AC.loggedin_user = USERS.id
            JOIN ${this.sql(subjects.table_name)} AS SUBJ ON AC.subject = SUBJ.id
            WHERE AC.subject = ${subject_id};
        `;
    }

    async fetchForSubjectAndUser(subject_id: number, user_id: number) {
        return await this.sql`
            SELECT AC.id, AC.subject, AC.loggedin_user, AC.does_fill_attendance, AC.does_fill_grades, AC.is_original_owner, 
                USERS.username AS user_name, USERS.role AS user_role, SUBJ.subject_name AS subject_name
            FROM ${this.sql(this.table_name)} AS AC
            JOIN ${this.sql(loggedin_users.table_name)} AS USERS ON AC.loggedin_user = USERS.id
            JOIN ${this.sql(subjects.table_name)} AS SUBJ ON AC.subject = SUBJ.id
            WHERE AC.subject = ${subject_id} AND AC.loggedin_user = ${user_id};
        `;
    }

    async filterByClassDegree(uid: number, degree: string, class_id: number) {

        return await this.sql`
            SELECT 
                SUBJ.id, SUBJ.subject_name, SUBJ.subject_normalized_name, SUBJ.teacher,
                SUBJ.degree, SUBJ.class, SUBJ.total_hours, SUBJ.hours_weekly,
                SUBJ.is_attending_required, SUBJ.semester, TEACH.teacher_name
            FROM ${this.sql(this.table_name)} AS AC
            JOIN ${this.sql(subjects.table_name)} AS SUBJ ON AC.subject = SUBJ.id
            JOIN ${this.sql(teaching_staff.table_name)} AS TEACH ON SUBJ.teacher = TEACH.id 
            WHERE SUBJ.degree = ${degree} 
            AND SUBJ.class = ${class_id} 
            AND AC.loggedin_user = ${uid}`;
    }

    async filterByDegree(uid: number, degree: string) {

        return await this.sql`
            SELECT 
                SUBJ.id, SUBJ.subject_name, SUBJ.subject_normalized_name, SUBJ.teacher,
                SUBJ.degree, SUBJ.class, SUBJ.total_hours, SUBJ.hours_weekly,
                SUBJ.is_attending_required, SUBJ.semester, TEACH.teacher_name
            FROM ${this.sql(this.table_name)} AS AC
            JOIN ${this.sql(subjects.table_name)} AS SUBJ ON AC.subject = SUBJ.id
            JOIN ${this.sql(teaching_staff.table_name)} AS TEACH ON SUBJ.teacher = TEACH.id 
            WHERE SUBJ.degree = ${degree} AND AC.loggedin_user = ${uid}`;
    }

}


import { PG_Table, type PG_App } from "pg-norm";
import type Postgres from "postgres";
export declare class TeachingStaff extends PG_Table {
    constructor(app: PG_App);
    /** NOTE: availability_bitmap is used for automatic time table generation */
    create(): Promise<void>;
    autocomplete(searched_name: string): Promise<Postgres.RowList<Postgres.Row[]>>;
    findByName(normalized_name: string): Promise<Postgres.Row | undefined>;
    fetchByUserId(user_id: number): Promise<Postgres.Row | undefined>;
}
//# sourceMappingURL=teaching_staff.d.ts.map
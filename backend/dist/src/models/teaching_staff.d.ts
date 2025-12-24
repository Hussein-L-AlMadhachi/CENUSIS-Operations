import { PG_Table, type PG_App } from "pg-norm";
export declare class TeachingStaff extends PG_Table {
    constructor(app: PG_App);
    /** NOTE: availability_bitmap is used for automatic time table generation */
    create(): Promise<void>;
    autocomplete(searched_name: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
    findByName(normalized_name: string): Promise<import("postgres").RowList<import("postgres").Row[]>>;
}
//# sourceMappingURL=teaching_staff.d.ts.map
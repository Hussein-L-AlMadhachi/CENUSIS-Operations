import { PG_Table, type PG_App } from "pg-norm";
import type postgres from "postgres";
export declare class Subjects extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    filterByYear(year: number): Promise<postgres.RowList<postgres.Row[]>>;
    filterByTeacher(teacher_id: number): Promise<postgres.RowList<postgres.Row[]>>;
    filterByName(name: string): Promise<postgres.RowList<postgres.Row[]>>;
}
export declare const subjects: Subjects;
//# sourceMappingURL=subjects.d.ts.map
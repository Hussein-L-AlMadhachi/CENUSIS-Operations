import { PG_Table, type PG_App } from "pg-norm";
export declare class StudentsTable extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
}
export declare const students: StudentsTable;
//# sourceMappingURL=students.d.ts.map
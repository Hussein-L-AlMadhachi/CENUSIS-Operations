import { PG_Table, type PG_App } from "pg-norm";
export declare class StudentAbsenceView extends PG_Table {
    constructor(app: PG_App);
    create(): Promise<void>;
    addAbsence(student_id: number, attendance_record_id: number, hours_absent: number): Promise<void>;
}
//# sourceMappingURL=students_absence_view.d.ts.map
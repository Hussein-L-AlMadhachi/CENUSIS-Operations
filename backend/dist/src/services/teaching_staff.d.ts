import type { Metadata } from "enders-sync";
import type postgres from "postgres";
export declare function registerTeacher(metadata: Metadata, data: any): Promise<any>;
export declare function registerAdmin(metadata: Metadata, name: string, password: string): Promise<postgres.Row | undefined>;
export declare function updateUser(metadata: Metadata, uid: number, data: any): Promise<number>;
export declare function updateSelf(metadata: Metadata, data: any): Promise<number>;
export declare function deleteUser(metadata: Metadata, id: number): Promise<void>;
export declare function changeSelfPassword(metadata: Metadata, new_password: string): Promise<postgres.RowList<postgres.Row[]>>;
export declare function changeTeacherPassword(metadata: Metadata, id: number, new_password: string): Promise<postgres.RowList<postgres.Row[]>>;
export declare function getProfile(metadata: Metadata): Promise<postgres.Row>;
export declare function fetchTeachers(metadata: Metadata): Promise<postgres.Row>;
export declare function registerMeAsTeacher(metadata: Metadata, data: any): Promise<postgres.Row>;
export declare function autocompleteTeacher(metadata: Metadata, name: string): Promise<string[]>;
//# sourceMappingURL=teaching_staff.d.ts.map
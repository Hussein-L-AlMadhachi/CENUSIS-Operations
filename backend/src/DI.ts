// dependency injection for the admin core handlers


import type { RPC } from "enders-sync";
import { teachingStaffLoader } from "./Features/teaching_staff/@loader.js";
import { studentsLoader } from "./Features/students/@loader.js";
import { gradingSystemsLoader } from "./Features/grading_system/@loader.js";
import { subjectsLoader } from "./Features/subjects/@loader.js";
import { studyingLoader } from "./Features/studying/@loader.js";
import { gradingLoader } from "./Features/grading/@loader.js";
import { attendanceRecordLoader } from "./Features/attendance_record/@loader.js";
import { absentedLoader } from "./Features/absented/@loader.js";

export function registerAdminCoreHandlers(rpc: RPC) {
    teachingStaffLoader(rpc);
    studentsLoader(rpc);
    subjectsLoader(rpc);
    gradingSystemsLoader(rpc);
    studyingLoader(rpc);
    gradingLoader(rpc);
}

export function registerTeacherAttendanceHandlers(rpc: RPC) {
    attendanceRecordLoader(rpc);
    absentedLoader(rpc);
}
import { type RPC } from "enders-sync";
import {
    createDailyAttendanceRecord,
    fetchDailyAttendanceRecordsForTheSubject,
} from "./attendance_record.service.js";

export function attendanceRecordLoader(rpc: RPC) {
    rpc.add(fetchDailyAttendanceRecordsForTheSubject);
    rpc.add(createDailyAttendanceRecord);
}

import { subjects, attendance_record, attendance_record_view } from "../db.js";
export async function createDailyAttendanceRecord(metadata, subject_id, date) {
    if (typeof subject_id !== "number") {
        throw new Error("subject_id must be a number");
    }
    // access control
    const uid = metadata.auth.user_id;
    if (typeof uid !== "number") {
        throw new Error("You are not authenticated");
    }
    const result = await attendance_record.insert({
        subject: subject_id,
        date,
    });
    return result;
}
export async function fetchDailyAttendanceRecordsForTheSubject(metadata, subject_id) {
    if (typeof subject_id !== "number") {
        throw new Error("subject_id must be a number");
    }
    // access control
    const result = await attendance_record.findBySubject(subject_id);
    return result;
}
//# sourceMappingURL=attendance_record.js.map
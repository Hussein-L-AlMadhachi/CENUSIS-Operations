import { attendance_record } from "../../db.js";
import type { Metadata } from "enders-sync";
import type postgres from "postgres"



export async function createDailyAttendanceRecord(metadata: Metadata, subject_id: number, date: string, lab_attendance: boolean) {
    if (typeof subject_id !== "number") {
        throw new Error("subject_id must be a number");
    }

    if (!lab_attendance) lab_attendance=false;

    // access control
    const uid = metadata.auth.user_id;
    if (typeof uid !== "number") {
        throw new Error("You are not authenticated");
    }

    const result = await attendance_record.insert({
        subject: subject_id,
        date:date,
        lab_attendance: lab_attendance,
    });

    return result;
}



export async function fetchDailyAttendanceRecordsForTheSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>> {
    if (typeof subject_id !== "number") {
        throw new Error("subject_id must be a number");
    }

    // access control

    const result = await attendance_record.findBySubject(subject_id);
    return result;
}



export async function fetchDailyLabAttendanceRecordsForTheSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>> {
    if (typeof subject_id !== "number") {
        throw new Error("subject_id must be a number");
    }

    // access control

    const result = await attendance_record.findByLabSubject(subject_id);
    return result;
}

export async function fetchAttendanceRecordWithSubject(metadata: Metadata, attendance_record_id: number) {
    if (typeof attendance_record_id !== "number") {
        throw new Error("attendance_record_id must be a number");
    }

    const result = await attendance_record.fetchWithSubject(attendance_record_id);
    if (!result) {
        throw new Error("Attendance record not found");
    }
    return result;
}


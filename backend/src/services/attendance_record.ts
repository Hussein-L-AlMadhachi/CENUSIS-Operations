import { subjects, attendance_record, attendance_record_view } from "../db.js";
import type { Metadata } from "enders-sync";
import type postgres from "postgres"



export async function createDailyAttendanceRecord(metadata: Metadata, subject_id: number, date: string) {
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



export async function fetchDailyAttendanceRecordsForTheSubject(metadata: Metadata, subject_id: number): Promise<postgres.RowList<postgres.Row[]>> {
    if (typeof subject_id !== "number") {
        throw new Error("subject_id must be a number");
    }

    // access control

    const result = await attendance_record.findBySubject(subject_id);
    return result;
}


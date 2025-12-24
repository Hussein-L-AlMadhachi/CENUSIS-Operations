import { absented, attendance_record, students, studying } from "../db.js";
import type { Metadata } from "enders-sync";
import { validate_params } from "../helpers/validate_params.js";
import { normalize_arabic } from "../helpers/normalize_arabic.js";



export async function markStudentAbsent(metadata: Metadata, data: any) {
    validate_params(data, ["attendance_record_id", "student_name", "hours_absent"]);

    const { attendance_record_id, student_name, hours_absent } = data;

    // Fetch attendance record to get the studying ID
    const [record] = await attendance_record.fetch(attendance_record_id);
    if (!record) {
        throw new Error("Attendance record not found");
    }

    // Fetch studying record to get the student ID
    const student_record = await students.findByName(normalize_arabic(student_name));
    if (!student_record) {
        throw new Error("Student not found");
    }

    const student_id = student_record.id;

    await absented.markAbsent(student_id, attendance_record_id, hours_absent);

}



export async function fetchAbsentStudents(metadata: Metadata, attendance_record_id: number) {
    const [record] = await attendance_record.fetch(attendance_record_id);
    if (!record) {
        throw new Error("Attendance record not found");
    }

    const students = await absented.findByAttendanceRecord(attendance_record_id);
    return students;
}



export async function removeAbsence(metadata: Metadata, absented_id: number) {

    if (!absented_id || typeof absented_id !== "number") {
        throw new Error("Absented ID is required");
    }

    await absented.removeAbsence(absented_id);
}


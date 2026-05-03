import { absented, attendance_record, students } from "../../db.js";
import type { Metadata } from "enders-sync";
import { validate_params } from "../../helpers/validate_params.js";



export async function markStudentAbsent(metadata: Metadata, data: any) {
    validate_params(data, ["attendance_record_id", "student_id", "hours_absent"]);

    const { attendance_record_id, student_id, hours_absent } = data;

    if (typeof student_id !== "number") {
        throw new Error("student_id must be a valid number");
    }

    if (typeof hours_absent !== "number" || Number.isNaN(hours_absent)) {
        throw new Error("hours_absent must be a valid number");
    }

    // Fetch attendance record to get the studying ID
    const [record] = await attendance_record.fetch(attendance_record_id);
    if (!record) {
        throw new Error("Attendance record not found");
    }

    // Fetch studying record to get the student ID
    const [student_record] = await students.fetch(student_id);
    if (!student_record) {
        throw new Error("Student not found");
    }

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

export async function updateAbsence(metadata: Metadata, data: any) {
    validate_params(data, ["absented_id", "hours_absent"]);

    const { absented_id, hours_absent } = data;
    if (typeof absented_id !== "number") {
        throw new Error("Absented ID is required");
    }

    if (typeof hours_absent !== "number" || Number.isNaN(hours_absent)) {
        throw new Error("hours_absent must be a valid number");
    }

    await absented.updateAbsence(absented_id, hours_absent);
}

export async function markStudentAbsentBulk(metadata: Metadata, data: any) {
    validate_params(data, ["attendance_record_id", "student_ids", "hours_absent"]);

    const { attendance_record_id, student_ids, hours_absent } = data;

    if (!Array.isArray(student_ids) || student_ids.length === 0) {
        throw new Error("student_ids must be a non-empty array");
    }

    if (typeof hours_absent !== "number" || Number.isNaN(hours_absent)) {
        throw new Error("hours_absent must be a valid number");
    }

    const [record] = await attendance_record.fetch(attendance_record_id);
    if (!record) {
        throw new Error("Attendance record not found");
    }

    for (const student_id of student_ids) {
        if (typeof student_id !== "number") {
            throw new Error("Each student_id must be a valid number");
        }

        const [student_record] = await students.fetch(student_id);
        if (!student_record) {
            throw new Error(`Student ${student_id} not found`);
        }
    }

    await absented.markAbsentBulk(student_ids, attendance_record_id, hours_absent);
}

 
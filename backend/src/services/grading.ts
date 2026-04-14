import type { Metadata } from "enders-sync";
import { studying } from "../db.js";



export async function fetchStudentGradeFieldsPerStudying(metadata: Metadata, subject_id: number) {
    const gradeFields = await studying.getGradeFields(subject_id);

    console.log(gradeFields)

    if (!gradeFields) {
        throw new Error("Grade fields not found");
    }

    return gradeFields;
}


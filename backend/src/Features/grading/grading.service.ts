import type { Metadata } from "enders-sync";
import { studying } from "../../db.js";



export async function fetchStudentGradeFieldsPerStudying(metadata: Metadata, subject_id: number) {
    const gradeFields = await studying.getGradeFields(subject_id);

    if (!gradeFields) {
        throw new Error("Grade fields not found");
    }

    return gradeFields;
}

export async function fetchStudentLabGradesPerStudying(metadata: Metadata, subject_id: number) {
    const labGrades = await studying.getLabGrades(subject_id);

    if (!labGrades) {
        throw new Error("Lab grades not found");
    }

    return labGrades;
}


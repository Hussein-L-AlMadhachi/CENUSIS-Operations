import type { Metadata } from "enders-sync";
import { studying } from "../db.js";



export async function fetchStudentCourseworkGradesPerStudying(metadata: Metadata, studying_id: number) {
    const courseworkGrade = await studying.getCourseworkGrades(studying_id);

    console.log(courseworkGrade)

    if (!courseworkGrade) {
        throw new Error("Coursework grade not found");
    }

    return courseworkGrade;
}


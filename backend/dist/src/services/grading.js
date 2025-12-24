import { studying } from "../db.js";
export async function fetchStudentCourseworkGradesPerStudying(metadata, studying_id) {
    const courseworkGrade = await studying.getCourseworkGrades(studying_id);
    console.log(courseworkGrade);
    if (!courseworkGrade) {
        throw new Error("Coursework grade not found");
    }
    return courseworkGrade;
}
//# sourceMappingURL=grading.js.map
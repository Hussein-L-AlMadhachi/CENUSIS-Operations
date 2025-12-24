import { teaching_staff, subjects, studying, students, enrollment_view } from "../db.js";
import { normalize_arabic } from "../helpers/normalize_arabic.js";
import { loose_validate_params, validate_params } from "../helpers/validate_params.js";
export async function newEnrollment(metadata, data) {
    if (data["teacher_name"])
        delete data["teacher_name"];
    if (data["student_name"])
        delete data["student_name"];
    validate_params(data, [
        "teacher_id", "student_id", "subject_id", "exam_retakes", "semester_retakes", "studying_year",
        "hours_missed", "coursework_grade_percent", "finals_grade_percent"
    ]);
    data["teacher"] = data["teacher_id"];
    data["student"] = data["student_id"];
    data["subject"] = data["subject_id"];
    delete data["teacher_id"];
    delete data["student_id"];
    delete data["subject_id"];
    console.log(data);
    // check to which teacher the subject is assigned
    const [studying_students] = await studying.insert(data);
    if (!studying_students) {
        throw new Error("Teacher not found");
    }
}
export async function updateEnrollment(metadata, id, data) {
    loose_validate_params(data, [
        "teacher_id", "student_id", "subject_id", "exam_retakes", "semester_retakes", "studying_year",
        "hours_missed", "coursework_grade_percent", "finals_grade_percent", "semester"
    ]);
    if (data["teacher_name"])
        delete data["teacher_name"];
    if (data["student_name"])
        delete data["student_name"];
    if (data["teacher_id"])
        data["teacher"] = data["teacher_id"];
    if (data["student_id"])
        data["student"] = data["student_id"];
    if (data["semester"] !== undefined) {
        if (typeof data["semester"] !== "number" || data["semester"] < 1 || data["semester"] > 2) {
            throw new Error("Unexpected error: semester cannot be anythin but a number between 1 and 2");
        }
    }
    await studying.update(id, data);
    return id;
}
export async function deleteEnrollment(metadata, id) {
    await studying.delete(id);
}
export async function fetchSingleEnrollment(metadata, id) {
    const [result] = await studying.fetch(id);
    if (!result) {
        throw new Error("no enrollment found");
    }
    return result;
}
export async function fetchEnrollmentsForSubject(metadata, subject_id) {
    const result = await studying.findBySubject(subject_id);
    if (!result) {
        throw new Error("no enrollment found");
    }
    return result;
}
// CRITICAL:   ONLY TO BE SHOWN TO SUPERUSER AND THE TEACHER OF THE SUBJECT EXCLUSIVELY
export async function fetchCourseworkGradesWithDataForSubject(metadata, subject_id) {
    const result = await enrollment_view.findBySubject(subject_id);
    if (!result) {
        throw new Error("no enrollment found");
    }
    return result;
}
export async function setCourseworkGradeAndFinalsGrade(metadata, coursework_grade, student_id, subject_id) {
    await studying.setCourseworkGrade(coursework_grade, student_id, subject_id);
}
export async function autoFillStudentsByDegreeClass(metadata, degree, class_number, subject_id, studying_year, coursework_grade_percent, finals_grade_percent) {
    // verify subject id
    const [subject] = await subjects.fetch(subject_id);
    if (!subject) {
        throw new Error("subject not found");
    }
    if (subject.degree !== degree) {
        throw new Error("degree does not match");
    }
    if (subject.class_number !== class_number) {
        throw new Error("class number does not match");
    }
    await studying.autoInsertStudentsForSubject(subject_id, degree, class_number, studying_year, coursework_grade_percent, finals_grade_percent);
}
//# sourceMappingURL=studying.js.map
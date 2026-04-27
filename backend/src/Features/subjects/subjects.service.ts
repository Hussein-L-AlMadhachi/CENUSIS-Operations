import { grading_systems, studying, teaching_staff, subjects, students } from "../../db.js";
import type { Metadata } from "enders-sync";
import type postgres from "postgres"



import { normalize_arabic } from "../../helpers/normalize_arabic.js";
import { loose_validate_params, validate_params } from "../../helpers/validate_params.js";

async function resolveGradingSystemId(data: Record<string, any>) {
    if (typeof data["grading_system_id"] === "number") {
        const [gradingSystem] = await grading_systems.fetch(data["grading_system_id"]);

        if (!gradingSystem) {
            throw new Error("grading system not found");
        }

        return gradingSystem.id as number;
    }

    if (typeof data["grading_system_name"] === "string") {
        const gradingSystem = await grading_systems.findByName(normalize_arabic(data["grading_system_name"]));

        if (!gradingSystem) {
            throw new Error("grading system not found");
        }

        return gradingSystem.id as number;
    }

    throw new Error("grading_system_id or grading_system_name is required");
}



export async function newSubject(metadata: Metadata, data: any) {

    validate_params(data, [
        "subject_name", "degree", "class", "hours_weekly", "teacher_name", "semester", "grading_system_name"
    ]);

    console.log(data)

    if (typeof data["teacher_name"] !== "string") {
        throw new Error("Unexpected error: teacher_name cannot be anythin but a string");
    }

    data["semester"] = Number(data["semester"]);
    data["class"] = Number(data["class"]);
    data["hours_weekly"] = Number(data["hours_weekly"]);
    console.log(data);

    if (typeof data["semester"] !== "number" || data["semester"] < 1 || data["semester"] > 2) {
        throw new Error("Unexpected error: semester cannot be anythin but a number between 1 and 2");
    }

    if (typeof data["hours_weekly"] !== "number" || data["hours_weekly"] <= 0 || data["hours_weekly"] > data["total_hours"]) {
        throw new Error("Unexpected error: hours_weekly must be a positive number and not exceed total_hours");
    }

    // check to which teacher the subject is assigned
    const teacher = await teaching_staff.findByName(normalize_arabic(data["teacher_name"]));

    console.log(teacher);

    if (!teacher) {
        throw new Error("لم يتم العثور على التدريسي");
    }

    data["teacher"] = teacher.id as number;
    delete data["teacher_name"];

    data["grading_system_id"] = await resolveGradingSystemId(data);
    delete data["grading_system_name"];

    data["subject_normalized_name"] = normalize_arabic(data["subject_name"]);
    data["total_hours"] = data["hours_weekly"] * 15

    const existingSubject = await subjects.findByName(data["subject_normalized_name"]);
    if (existingSubject) {
        throw new Error("المادة الدراسية موجودة بالفعل في النظام");
    }

    console.log(data);
    let subject: postgres.Row | undefined;
    try {
        [subject] = await subjects.insert(data);
    } catch (err: any) {
        if (err?.code === "23505") {
            throw new Error("المادة الدراسية موجودة بالفعل في النظام");
        }

        throw Error("حدث خطأ أثناء إضافة المادة الدراسية");
    }

    if (!subject) {
        throw new Error("حدث خطأ أثناء إضافة المادة الدراسية");
    }

    await studying.bulkInsertBySubject(subject.id as number);

    return subject.id;
}



// update

export async function updateSubject(metadata: Metadata, id: number, data: any) {
    console.log(data);

    delete data["name"];
    delete data["id"];

    loose_validate_params(data, [
        "subject_name", "degree", "class", "total_hours", "hours_weekly", "is_attending_required", "teacher_name", "semester", "grading_system_name"
    ]);


    data["subject_normalized_name"] = normalize_arabic(data["subject_name"]);

    // check to which teacher the subject is assigned
    const teacher = await teaching_staff.findByName(data["teacher_name"]);
    if (!teacher) {
        throw new Error("Teacher not found");
    }

    data["teacher"] = teacher.id as number;
    delete data["teacher_name"];

    data["grading_system_id"] = await resolveGradingSystemId(data);
    delete data["grading_system_name"];

    if (typeof id !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    if (typeof data["semester"] !== "number" || data["semester"] < 1 || data["semester"] > 2) {
        throw new Error("Unexpected error: semester cannot be anythin but a number between 1 and 2");
    }

    await subjects.update(id, data);
    return id;
}



// delete

export async function deleteSubject(metadata: Metadata, id: number) {
    await subjects.delete(id);
}

export async function autocompleteStudentsBySubject(metadata: Metadata, searched_name: string, subject_id: number) {
    const result = await subjects.autocompleteStudentsBySubject(searched_name, subject_id);
    if (!result) {
        return [];
    }

    const flattened_result: string[] = result.map((user) => {
        return user.student_name;
    });

    return flattened_result;
}
// Fetching and filtering

export async function fetchSingleSubject(metadata: Metadata, id: number) {

    const [result] = await subjects.fetch(id);

    if (!result) {
        throw new Error("no subject found");
    }

    return result;
}



export async function fetchSubjects(metadata: Metadata): Promise<postgres.RowList<postgres.Row[]>> {

    const result = await subjects.listAll();
    if (!result) {
        throw new Error("no subjects found");
    }

    return result;
}



export async function filterSubjectsByClassDegree(metadata: Metadata, degree: string, subject_class: number): Promise<postgres.RowList<postgres.Row[]>> {

    const result = await subjects.filterByClassDegree(degree, subject_class);
    if (!result) {
        throw new Error("no subjects found");
    }

    return result;
}



export async function filterSubjectsByDegree(metadata: Metadata, degree: string): Promise<postgres.RowList<postgres.Row[]>> {

    const result = await subjects.filterByDegree(degree);
    if (!result) {
        throw new Error("no subjects found");
    }

    return result;
}



export async function autocompleteSubject(metadata: Metadata, name: string): Promise<string[]> {
    const result = await subjects.autocomplete(name);
    if (!result) {
        throw new Error("no subjects found");
    }

    const flattened_result: string[] = result.map((user) => {
        return user.subject_name;
    });

    return flattened_result;
}



export async function findSubjectByName(metadata: Metadata, name: string): Promise<postgres.Row> {
    const result = await subjects.findByName(name);
    if (!result) {
        throw new Error("no subjects found");
    }

    return result;
}



export async function fetchSubjectsByTeacher(metadata: Metadata, degree: string, subject_class?: number): Promise<postgres.RowList<postgres.Row[]>> {
    const uid = metadata.auth.user_id as number;

    const teacher = await teaching_staff.fetchByUserId(uid);
    if (!teacher) {
        throw new Error("teacher not authorized");
    }

    let result;
    if (subject_class) {
        result = await subjects.filterByTeacherClassDegree(teacher.id as number, degree, subject_class);
        if (!result) {
            throw new Error("no subjects found");
        }
    } else {
        result = await subjects.filterByTeacherDegree(teacher.id as number, degree);
        if (!result) {
            throw new Error("no subjects found");
        }
    }

    return result;
}


import { teaching_staff, subjects } from "../db.js";
import type { Metadata } from "enders-sync";
import type postgres from "postgres"
import { error } from "console";



import { normalize_arabic } from "../helpers/normalize_arabic.js";
import { loose_validate_params, validate_params } from "../helpers/validate_params.js";



// insert

export async function newSubject(metadata: Metadata, data: any) {

    validate_params(data, [
        "subject_name", "degree", "class", "total_hours", "hours_weekly", "teacher_name", "semester"
    ]);

    if (typeof data["teacher_name"] !== "string") {
        throw new Error("Unexpected error: teacher_name cannot be anythin but a string");
    }

    data["semester"] = Number(data["semester"]);
    data["class"] = Number(data["class"]);
    console.log(data);

    if (typeof data["semester"] !== "number" || data["semester"] < 1 || data["semester"] > 2) {
        throw new Error("Unexpected error: semester cannot be anythin but a number between 1 and 2");
    }

    // check to which teacher the subject is assigned
    const teacher = await teaching_staff.findByName(normalize_arabic(data["teacher_name"]));

    console.log(teacher);

    if (!teacher) {
        throw new Error("لم يتم العثور على التدريسي");
    }

    data["teacher"] = teacher.id as number;
    delete data["teacher_name"];

    data["subject_normalized_name"] = normalize_arabic(data["subject_name"]);

    console.log(data);
    const [subject] = await subjects.insert(data);

    if (!subject) {
        throw error("Subject is already in the database");
    }

    return subject.id;
}



// update

export async function updateSubject(metadata: Metadata, id: number, data: any) {
    console.log(data);

    delete data["name"];
    delete data["id"];

    loose_validate_params(data, [
        "subject_name", "degree", "class", "total_hours", "hours_weekly", "is_attending_required", "teacher_name", "semester"
    ]);


    data["subject_normalized_name"] = normalize_arabic(data["subject_name"]);

    // check to which teacher the subject is assigned
    const teacher = await teaching_staff.findByName(data["teacher_name"]);
    if (!teacher) {
        throw new Error("Teacher not found");
    }

    data["teacher"] = teacher.id as number;
    delete data["teacher_name"];

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


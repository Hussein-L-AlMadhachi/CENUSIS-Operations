import { students, loggedin_users } from "../db.js";
import { error } from "console";
import { normalize_arabic } from "../helpers/normalize_arabic.js";
import { loose_validate_params, validate_params } from "../helpers/validate_params.js";
// insert
export async function newStudent(metadata, data) {
    validate_params(data, [
        "student_name", "joined_year", "degree", "class", "sex"
    ]);
    if (data["sex"] !== "ذكر" && data["sex"] !== "انثى") {
        throw new Error("sex must be 'ذكر' or 'انثى'");
    }
    if (data["degree"] !== "بكلوريوس" && data["degree"] !== "ماجستير" && data["degree"] !== "دكتوراه") {
        throw new Error("degree must be 'بكلوريوس' or 'ماجستير' or 'دكتوراه'");
    }
    data["student_normalized_name"] = normalize_arabic(data["student_name"]);
    console.log(data);
    const [user] = await students.insert(data);
    if (!user) {
        throw error("User is already in the database");
    }
    return user.id;
}
// update
export async function updateStudent(metadata, uid, data) {
    loose_validate_params(data, [
        "student_name", "joined_year", "degree", "class", "sex"
    ]);
    if (data["sex"] !== "ذكر" && data["sex"] !== "انثى") {
        throw new Error("sex must be 'ذكر' or 'انثى'");
    }
    data["student_normalized_name"] = normalize_arabic(data["student_name"]);
    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }
    await students.update(uid, data);
    return uid;
}
// delete
export async function deleteStudent(metadata, id) {
    await students.delete(id);
}
// Fetching and filtering
export async function fetchStudentInfo(metadata, id) {
    const [result] = await students.fetch(id);
    if (!result) {
        throw new Error("no user found");
    }
    return result;
}
export async function fetchStudents(metadata) {
    const result = await students.listAll();
    if (!result) {
        throw new Error("no user found");
    }
    return result;
}
export async function filterStudentsByClassDegree(metadata, degree, student_class) {
    const result = await students.filterStudentsByClassDegree(degree, student_class);
    if (!result) {
        throw new Error("no user found");
    }
    return result;
}
export async function filterStudentsByDegree(metadata, degree) {
    const result = await students.filterStudentsByDegree(degree);
    if (!result) {
        throw new Error("no user found");
    }
    return result;
}
export async function autocompleteStudent(metadata, name) {
    const result = await students.autocomplete(name);
    if (!result) {
        throw new Error("no user found");
    }
    const flattened_result = result.map((user) => {
        return user.student_name;
    });
    return flattened_result;
}
export async function findStudentByName(metadata, name) {
    const result = await students.findByName(normalize_arabic(name));
    console.log(result);
    if (!result) {
        throw new Error("no user found");
    }
    return result;
}
//# sourceMappingURL=students.js.map
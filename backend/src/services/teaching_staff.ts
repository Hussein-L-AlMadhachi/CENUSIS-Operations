import { teaching_staff, loggedin_users } from "../db.js";
import type { Metadata } from "enders-sync";
import type postgres from "postgres"
import { error } from "console";



import { normalize_arabic } from "../helpers/normalize_arabic.js";
import { loose_validate_params, validate_params } from "../helpers/validate_params.js";



export async function registerTeacher(metadata: Metadata, data: any) {

    validate_params(data, ["teacher_name", "password"]);

    if (!data["password"]) {
        throw new Error("password field is required");
    }

    if (data["teacher_name"]) {
        data["teacher_normalized_name"] = normalize_arabic(data["teacher_name"]);
    } else {
        throw new Error("teacher_name field is required");
    }

    const user_data = {
        username: data["teacher_name"],
        normalized_username: data["teacher_normalized_name"],
        role: "teacher",
        password: data["password"]
    }

    const [user] = await loggedin_users.insert(user_data);

    const teacher_data = {
        teacher_name: data.teacher_name,
        teacher_normalized_name: data.teacher_normalized_name,
        login_credentials: user!.id
    };

    let teacher: any;
    try {
        [teacher] = await teaching_staff.insert(teacher_data);

        if (!teacher) {
            loggedin_users.delete(user!.id)
        }

    } catch (e) {
        loggedin_users.delete(user!.uid)
        throw e;
    }


    return teacher!.id;
}



export async function registerAdmin(metadata: Metadata, name: string, password: string) {

    const [uid] = await loggedin_users.insert({
        username: name,
        normalized_username: normalize_arabic(name),
        role: "admin",
        password: password
    })

    return uid;
}



export async function updateUser(metadata: Metadata, uid: number, data: any) {
    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    loose_validate_params(data, ["teacher_name", "password"]);

    data["teacher_normalized_name"] = normalize_arabic(data["teacher_name"]);

    if (data["password"]) {
        await changeTeacherPassword(metadata, uid, data["password"]);
    }

    await teaching_staff.update(uid, { teacher_name: data.teacher_name, teacher_normalized_name: data.teacher_normalized_name });
    return uid;
}



export async function updateSelf(metadata: Metadata, data: any) {
    loose_validate_params(data, ["teacher_name"]);

    const uid = metadata.auth.user_id;
    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    data["teacher_normalized_name"] = normalize_arabic(data["teacher_name"]);

    await teaching_staff.update(uid, { teacher_name: data.teacher_name, teacher_normalized_name: data.teacher_normalized_name });
    return uid;
}


export async function deleteUser(metadata: Metadata, id: number) {
    await teaching_staff.delete(id);
    await loggedin_users.delete(id);
}



export async function changeSelfPassword(metadata: Metadata, new_password: string) {
    if (!metadata.auth.id || typeof metadata.auth.id !== "number") {
        throw new Error("You need to be loggedin to change your password")
    }

    const uid = loggedin_users.updatePassword(metadata.auth.id, new_password);

    if (!uid) {
        throw new Error("couldn't find user");
    }

    return uid;
}

export async function changeTeacherPassword(
    metadata: Metadata, id: number, new_password: string
) {
    if (!metadata.auth.id || typeof metadata.auth.id !== "number") {
        throw new Error("You need to be loggedin to change your password")
    }

    const uid = loggedin_users.updatePassword(id, new_password);

    if (!uid) {
        throw new Error("couldn't find user");
    }

    return uid;
}

export async function getProfile(metadata: Metadata) {
    const uid = metadata.auth.user_id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }
    const [result] = await teaching_staff.fetch(uid);

    if (!result) {
        throw new Error("no user found");
    }

    return result;
}



export async function fetchTeachers(metadata: Metadata): Promise<postgres.Row> {
    const uid = metadata.auth.user_id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const result = await teaching_staff.listAll();
    if (!result) {
        throw new Error("no user found");
    }

    return result;
}



export async function registerMeAsTeacher(metadata: Metadata, data: any): Promise<postgres.Row> {
    const uid = metadata.auth.user_id;

    if (typeof uid !== "number") {
        throw new Error("Unexpected error: user_id cannot be anythin but a number");
    }

    const [result] = await teaching_staff.insert({ id: metadata.auth.user_id, name: data.name, normalized_name: normalize_arabic(data.name) });

    if (result === undefined) {
        throw new Error("CRITICAL ERROR: this should be impossible; this could be a massive security vulnerbility. Report this to developer.")
    }

    return result;
}


export async function autocompleteTeacher(metadata: Metadata, name: string): Promise<string[]> {
    const result = await teaching_staff.autocomplete(name);

    if (!result) {
        throw new Error("no user found");
    }

    let list = [];

    for (const row of result) {
        list.push(row.teacher_name)
    }

    return list;
}


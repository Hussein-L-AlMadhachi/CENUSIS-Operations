import { loggedin_users, subjects, subjects_access_control, teaching_staff } from "../db.js";
import { normalize_arabic } from "../helpers/normalize_arabic.js";
export async function fetchSubjectAccessControl(metadata, subject_id) {
    // params validation
    const uid = metadata.auth.user_id;
    if (typeof uid !== "number") {
        throw new Error("قم بتسجيل الدخول أولاً");
    }
    if (typeof subject_id !== "number") {
        throw new Error("الرابط غير صحيح");
    }
    const result = await subjects_access_control.fetchForSubject(subject_id);
    return result;
}
export async function grantAccess(metadata, subject_name, teacher_name) {
    if (typeof subject_name !== "string") {
        throw new Error("الرابط غير صحيح");
    }
    if (typeof teacher_name !== "string") {
        throw new Error("الرابط غير صحيح");
    }
    const subject = await subjects.findByName(subject_name);
    if (!subject) {
        throw new Error("المادة غير موجودة");
    }
    const user = await loggedin_users.findByUserName(normalize_arabic(teacher_name));
    if (!user) {
        throw new Error("الحساب غير موجود");
    }
    const subject_id = subject.id;
    const user_id = user.id;
    try {
        await subjects_access_control.grant(subject_id, user_id);
    }
    catch (e) {
        throw new Error("حدث خطأ أثناء القيام بالعملبة");
    }
}
export async function revokeAccess(metadata, subject_id, user_id) {
    // params validation
    const uid = metadata.auth.user_id;
    if (typeof uid !== "number") {
        throw new Error("قم بتسجيل الدخول أولاً");
    }
    if (typeof subject_id !== "number") {
        throw new Error("الرابط غير صحيح");
    }
    if (typeof user_id !== "number") {
        throw new Error("الرابط غير صحيح");
    }
    try {
        await subjects_access_control.revoke(subject_id, user_id);
    }
    catch (e) {
        throw new Error("حدث خطأ أثناء القيام بالعملبة");
    }
}
export async function fetch_ta_subject_list(metadata, degree, subject_class) {
    // params validation
    const uid = metadata.auth.user_id;
    if (typeof uid !== "number") {
        throw new Error("قم بتسجيل الدخول أولاً");
    }
    if (typeof degree !== "string") {
        throw new Error("الرابط غير صحيح");
    }
    let result;
    if (subject_class) {
        result = await subjects_access_control.filterByClassDegree(uid, degree, subject_class);
    }
    else {
        result = await subjects_access_control.filterByDegree(uid, degree);
    }
    return result;
}
//# sourceMappingURL=subjects_access_control.js.map
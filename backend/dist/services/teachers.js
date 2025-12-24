import { teaching_staff } from "../models/teaching_staff.js";
import { loggedin_users } from "../models/loggedin_users.js";
export async function registerTeacher(name, availability_bitmap, hours_available) {
    const teacher_id = await teaching_staff.insert({ name, availability_bitmap, hours_available });
    if (teacher_id === undefined || teacher_id === null) {
        throw new Error("insert operation failed");
    }
    //await loggedin_users.insert(  )
}
export async function resetTeacherPassword(teacher_id, new_password) {
    return await loggedin_users.updatePassword(teacher_id, new_password);
}
//# sourceMappingURL=teachers.js.map
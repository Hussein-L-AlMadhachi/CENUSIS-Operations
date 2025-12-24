import { loggedin_users } from "../src/db.js";
import { normalize_arabic } from "../src/helpers/normalize_arabic.js";
const [uid_admin] = await loggedin_users.insert({
    username: "السكرتارية",
    normalized_username: normalize_arabic("السكرتارية"),
    role: "admin",
    password: "t#23DFpb"
});
const [uid2_superadmin] = await loggedin_users.insert({
    username: "رئيس القسم",
    normalized_username: normalize_arabic("رئيس القسم"),
    role: "superadmin",
    password: "489&^h7j"
});
console.log(` [DONE]  created ADMIN user (id:${uid_admin.id})`);
console.log(` [DONE]  created SUPERADMIN user (id:${uid2_superadmin.id})`);
//# sourceMappingURL=admin.js.map
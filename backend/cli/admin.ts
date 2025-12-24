import { loggedin_users } from "../src/db.js";
import { normalize_arabic } from "../src/helpers/normalize_arabic.js";
import * as fs from 'fs';
import * as path from 'path';



// Load configuration from JSON file
const configPath = path.join(process.cwd(), '../.default_accounts.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));



if (!config.admin.username || !config.admin.password || !config.superadmin.username || !config.superadmin.password) {
    console.error('Error: Invalid configuration file');
    process.exit(1);
}



const [uid_admin] = await loggedin_users.insert({
    username: config.admin.username,
    normalized_username: normalize_arabic(config.admin.username),
    role: "admin",
    password: config.admin.password
})

const [uid2_superadmin] = await loggedin_users.insert({
    username: config.superadmin.username,
    normalized_username: normalize_arabic(config.superadmin.username),
    role: "superadmin",
    password: config.superadmin.password
})



console.log(` [DONE]  created ADMIN user (id:${uid_admin!.id})`);
console.log(` [DONE]  created SUPERADMIN user (id:${uid2_superadmin!.id})`);

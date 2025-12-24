import { createRPC } from "enders-sync";
import {} from "express";
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generate_auth_validtor_for_roles, auth } from "./auth.js";
import { normalize_arabic } from "./helpers/normalize_arabic.js";
import { loggedin_users } from "./db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, '..', '.bots.json');
export function createBotRPC(app, ...methods_list) {
    let bots_configs = [];
    try {
        bots_configs = JSON.parse(readFileSync(configPath, "utf-8"));
    }
    catch (error) {
        console.error("Failed to load or parse bots.json. Please ensure the file exists and is valid JSON:", error);
        console.error("Bot RPCs will not be created.");
    }
    for (const bot_config of bots_configs) {
        if (!bot_config.role || !bot_config.username || !bot_config.password || !bot_config.methods) {
            console.error("Invalid bot configuration:", bot_config);
            console.error(`Bot @${bot_config.username} disabled`);
            continue;
        }
        // auth is an object with properties admin(), superadmin(), teacher() methods to validate those
        // bots can't overwrite real humans roles
        if (auth[bot_config.role] !== undefined) {
            console.error(` [!] Bots cannot use human role "${bot_config.role}"`);
            console.error(`Bot @${bot_config.username} disabled`);
            continue;
        }
        const bot_rpc = createRPC(app, `/api/bots/${encodeURIComponent(bot_config.role)}`, generate_auth_validtor_for_roles(bot_config.role));
        if (!loggedin_users.idAfterAuth(bot_config.username, bot_config.password)) { //db based doesn't deal with jwt auth
            loggedin_users.insert({
                username: bot_config.username,
                normalized_username: normalize_arabic(bot_config.username),
                role: bot_config.role,
                password: bot_config.password
            });
        }
        // optimizations are insignificant because this only runs once and you can have too many bots
        // to overwhelm the system anyway
        for (const method_name_assigned_to_bot of bot_config.methods) {
            for (const method of methods_list) {
                if (method.name === method_name_assigned_to_bot) {
                    bot_rpc.add(method);
                    break;
                }
            }
        }
        console.log(` ✅ Bot @${bot_config.username} (role: ${bot_config.role}) registered with ${bot_config.methods.length} methods`);
    }
}
/**

expected JSON

[
    {
        "role": "...",
        "username": "...",
        "password": "...",

        "methods": ["..."]
    }
]

 */ 
//# sourceMappingURL=bots-rpc.js.map
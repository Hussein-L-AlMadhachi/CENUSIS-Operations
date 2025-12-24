import jwt from 'jsonwebtoken';
import {} from 'enders-sync';
import { loggedin_users } from './db.js';
import {} from 'express';
import { normalize_arabic } from './helpers/normalize_arabic.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export function generate_auth_validtor_for_roles(role) {
    return (req) => {
        console.log(req.cookies);
        try {
            if (!req?.cookies) {
                return { success: false };
            }
            const token = req.cookies["auth-token"];
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log(decoded);
            if (typeof decoded.user_id !== "number" || typeof decoded.role !== "string") {
                console.log("user id not number or role not string");
                return {
                    success: false
                };
            }
            if (decoded.role !== role) {
                console.log("user role not match got: ", decoded.role, " != expected: ", role);
                return {
                    success: false
                };
            }
            console.log("user role match got: ", decoded.role, " == expected: ", role);
            return {
                success: true,
                metadata: {
                    auth: {
                        user_id: decoded.user_id,
                        role: decoded.role
                    }
                }
            };
        }
        catch (error) {
            return { success: false };
        }
    };
}
export const auth = {
    admin: generate_auth_validtor_for_roles("admin"),
    superadmin: generate_auth_validtor_for_roles("superadmin"),
    teacher: generate_auth_validtor_for_roles("teacher"),
};
export async function logout(metadata) {
    metadata.res.cookie("auth-token", "", {
        httpOnly: true
    });
}
export async function login(metadata, username, password) {
    if (typeof password !== "string" || typeof username !== "string") {
        throw new TypeError("RPC expects a username:string , password:string as input");
    }
    const user = await loggedin_users.fetchAfterAuth(normalize_arabic(username), password, ["role", "id"]);
    if (!user) {
        throw new Error("Unauthorized");
    }
    const user_id = user.id;
    const user_role = user.role;
    try {
        const token = jwt.sign({ role: user_role, user_id: user_id }, JWT_SECRET, {
            expiresIn: '1d',
            issuer: `${user_role}-auth-service`,
            audience: user_role
        });
        metadata.res.cookie("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 1000 // 1 day
        });
        return {
            role: user_role,
            user_id: user_id
        };
    }
    catch (error) {
        throw new Error('Error creating token');
    }
}
export function isValidAdminNoRPC(req, res) {
    const validation = auth.admin(req);
    if (validation.success === false) {
        return null;
    }
    const _auth = validation.metadata?.auth;
    return _auth;
}
export function isValidTeacherNoRPC(req, res) {
    const validation = auth.teacher(req);
    if (validation.success === false) {
        return null;
    }
    const _auth = validation.metadata?.auth;
    return _auth;
}
export function isValidSuperadminNoRPC(req, res) {
    const validation = auth.superadmin(req);
    if (validation.success === false) {
        return null;
    }
    const _auth = validation.metadata?.auth;
    return _auth;
}
//# sourceMappingURL=auth.js.map
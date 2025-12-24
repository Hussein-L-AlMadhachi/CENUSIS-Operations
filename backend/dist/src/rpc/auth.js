import jwt from 'jsonwebtoken';
import {} from 'enders-sync';
import { loggedin_users } from '../db.js';
import {} from 'express';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
function generate_auth_validtor_4_roles(role) {
    return (req) => {
        try {
            const token = req.cookies["auth-token"];
            const decoded = jwt.verify(token, JWT_SECRET);
            if (typeof decoded.user_id !== "number" || typeof decoded.role !== "string") {
                return {
                    success: false
                };
            }
            if (decoded.role !== role) {
                return {
                    success: false
                };
            }
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
    admin: generate_auth_validtor_4_roles("admin"),
    teacher: generate_auth_validtor_4_roles("teacher"),
};
export async function login(metadata, username, password) {
    if (typeof password !== "string" || typeof username !== "string") {
        throw new TypeError("RPC expects a username:string , password:string as input");
    }
    const user = await loggedin_users.fetchAfterAuth(username, password, ["role", "id"]);
    if (!user) {
        throw new Error("Unauthorized");
    }
    const user_id = user.id;
    const user_role = user.role;
    try {
        const token = jwt.sign({ role: user_role, user_id: user_id }, JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
            issuer: `${user_role}-auth-service`,
            audience: user_role
        });
        metadata.res.cookie("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 // 1 hour
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
//# sourceMappingURL=auth.js.map
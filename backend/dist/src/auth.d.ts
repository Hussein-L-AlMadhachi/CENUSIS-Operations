import { type Metadata, type Validator } from 'enders-sync';
import { type Request, type Response } from 'express';
export declare function generate_auth_validtor_for_roles(role: string): Validator;
export declare const auth: {
    admin: Validator;
    superadmin: Validator;
    teacher: Validator;
};
interface loggedIn {
    role: string;
    user_id: number;
}
export declare function logout(metadata: Metadata): Promise<void>;
export declare function login(metadata: Metadata, username: string | undefined, password: string | undefined): Promise<loggedIn>;
export declare function isValidAdminNoRPC(req: Request, res: Response): Record<string, string | number> | null | undefined;
export declare function isValidTeacherNoRPC(req: Request, res: Response): Record<string, string | number> | null | undefined;
export declare function isValidSuperadminNoRPC(req: Request, res: Response): Record<string, string | number> | null | undefined;
export {};
//# sourceMappingURL=auth.d.ts.map
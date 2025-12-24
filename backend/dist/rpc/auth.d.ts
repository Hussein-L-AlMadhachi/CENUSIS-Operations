import { type Metadata, type Validator } from 'enders-sync';
export declare const auth: {
    admin: Validator;
    teacher: Validator;
};
interface loggedIn {
    role: string;
    user_id: number;
}
export declare function login(metadata: Metadata, username: string | undefined, password: string | undefined): Promise<loggedIn>;
export {};
//# sourceMappingURL=auth.d.ts.map
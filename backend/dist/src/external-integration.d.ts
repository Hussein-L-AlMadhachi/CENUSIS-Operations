import { type RPCHandler } from "enders-sync";
import { type Express } from "express";
export declare function createBotRPC(app: Express, ...methods_list: RPCHandler[]): void;
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
//# sourceMappingURL=external-integration.d.ts.map
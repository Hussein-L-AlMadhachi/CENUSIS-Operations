import express from 'express';
import { createRPC } from 'enders-sync';
import { login, auth } from './rpc/auth.js';
export const app = express();
app.use(express.json());
// Create a public RPC instance (no authentication required)
export const publicRPC = createRPC(app, '/api/public', () => ({
    success: true
}));
publicRPC.add(login);
// Create a admin RPC instance
export const adminRPC = createRPC(app, '/api/admin', auth.admin);
// Create a teachers RPC instance
export const teachersRPC = createRPC(app, '/api/teacher', auth.teacher);
//# sourceMappingURL=app.js.map
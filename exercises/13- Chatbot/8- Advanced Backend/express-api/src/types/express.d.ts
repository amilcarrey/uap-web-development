import { User, BoardPermission } from "./index";

declare global {
    namespace Express {
        interface Request {
            user?: User;
            boardPermission?: BoardPermission;
        }
    }
}

// Necesario para que TypeScript lo reconozca como módulo
export {};
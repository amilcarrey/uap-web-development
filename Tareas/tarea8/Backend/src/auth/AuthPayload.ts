import { PermissionLevel } from "../models/Permission";

// Interface for the authentication payload
export interface AuthPayload {
    userId: number;
    alias: string;
    permissions: PermissionLevel[];
}
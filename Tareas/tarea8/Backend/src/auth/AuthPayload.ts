import { PermissionLevel } from "../models/Permission";
export interface AuthPayload {
    userId: number;
    alias: string;
    permissions: PermissionLevel[];
}
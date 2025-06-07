export interface UserDTO{
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    boardId: number[];
    permissionsId: number[];
    settingsId: number[];
}

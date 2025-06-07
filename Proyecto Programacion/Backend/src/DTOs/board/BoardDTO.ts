export interface BoardDTO{
    name: string;
    active: boolean;
    ownerId: number;
    tasksId: number[];
    permissionsId: number[];
}
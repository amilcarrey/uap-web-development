import { TaskDTO } from "../task/TaskDTO";
import { BoardDTO as IBoardDTO } from "./BoardDTO";

export interface BoardDTO {
    name: string;
    active: boolean;
    ownerId: number;
    tasks: TaskDTO[];
    permissionsId: number[];
}
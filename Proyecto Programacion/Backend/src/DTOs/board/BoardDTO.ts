import { TaskDTO } from "../task/TaskDTO";
import { BoardDTO as IBoardDTO } from "./BoardDTO";

export class BoardDTO implements IBoardDTO {
    name!: string;
    active!: boolean;
    ownerId!: number;
    tasks!: TaskDTO[];
    permissionsId!: number[];
}
import { Permission } from '../../models/Permission';
import { BoardDTO } from '../board/BoardDTO';
import { UserSettingsDTO } from '../settings/UserSettingsDTO'; 

export interface UserDTO {
    firstName: string;
    lastName: string;
    alias: string;
    boards: BoardDTO[];
    permissions: Permission[];
    settings: UserSettingsDTO | null;
}

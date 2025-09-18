import { BoardRepository } from "./board.repository";
import { CreateBoardDto, BoardResponseDto } from "./board.dto";

export class BoardService {
  private boardRepo = new BoardRepository();

  async getAllBoards(): Promise<BoardResponseDto[]> {
    const boards = await this.boardRepo.findAll();
    return boards.map(b => ({
      id: b.id,
      name: b.name,
      active: b.active,
      ownerId: b.ownerId,
    }));
  }

  async getBoardById(id: number): Promise<BoardResponseDto | null> {
    const b = await this.boardRepo.findById(id);
    if (!b) return null;
    return {
      id: b.id,
      name: b.name,
      active: b.active,
      ownerId: b.ownerId,
    };
  }

  async createBoard(dto: CreateBoardDto): Promise<BoardResponseDto> {
    const b = await this.boardRepo.create(dto);
    return {
      id: b.id,
      name: b.name,
      active: b.active,
      ownerId: b.ownerId,
    };
  }

  async deleteBoard(id: number): Promise<void> {
    await this.boardRepo.delete(id);
  }

  async boardExists(id: number): Promise<boolean> {
    return this.boardRepo.exists(id);
  }
}

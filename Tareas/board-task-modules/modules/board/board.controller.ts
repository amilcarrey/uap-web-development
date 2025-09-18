import { Request, Response } from "express";
import { BoardService } from "./board.service";
import { CreateBoardDto } from "./board.dto";

export class BoardController {
  private service = new BoardService();

  getAllBoards = async (req: Request, res: Response) => {
    try {
      const boards = await this.service.getAllBoards();
      res.json({ boards });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching boards" });
    }
  };

  getBoardById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const board = await this.service.getBoardById(id);
      if (!board) return res.status(404).json({ error: "Not found" });
      res.json({ board });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching board" });
    }
  };

  createBoard = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const dto: CreateBoardDto = { name: req.body.name, ownerId: userId };
      if (!dto.name) return res.status(400).json({ error: "Name is required" });

      const board = await this.service.createBoard(dto);
      res.status(201).json({ board });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error creating board" });
    }
  };

  deleteBoard = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const exists = await this.service.boardExists(id);
      if (!exists) return res.status(404).json({ error: "Board not found" });

      await this.service.deleteBoard(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting board" });
    }
  };
}

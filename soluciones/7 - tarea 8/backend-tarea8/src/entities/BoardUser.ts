import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from "typeorm";
import { User } from "./User";
import { Board } from "./Board";

@Entity()
@Unique(["user", "board"])
export class BoardUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.boardUsers, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Board, (board) => board.boardUsers, { onDelete: "CASCADE" })
  board!: Board;

  @Column()
  userId!: number;

  @Column()
  boardId!: number;

  @Column({ default: "read" }) // 'owner', 'edit', 'read'
  permission!: string;
}

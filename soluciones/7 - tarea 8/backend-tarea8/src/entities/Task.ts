import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Board } from "./Board";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => Board, (board) => board.tasks, { onDelete: "CASCADE" })
  board!: Board;

  @Column()
  boardId!: number;
}

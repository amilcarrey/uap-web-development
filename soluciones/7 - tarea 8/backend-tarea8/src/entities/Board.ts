import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BoardUser } from "./BoardUser";
import { Task } from "./Task";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
  boardUsers!: BoardUser[];

  @OneToMany(() => Task, (task) => task.board)
  tasks!: Task[];
}

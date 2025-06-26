import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BoardUser } from "./BoardUser";
import { Length, IsEmail } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @Length(6, 100)
  password!: string;

  @Column({ default: "user" })
  role!: string; // para posible rol admin, user, etc.

  @OneToMany(() => BoardUser, (boardUser) => boardUser.user)
  boardUsers!: BoardUser[];
}

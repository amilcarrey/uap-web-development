import { Board } from './Board';
import { Permission } from './Permission';
import { Settings } from './Settings';

export class User {
  #id: number;
  #firstName: string;
  #lastName: string;
  #username: string;
  #password: string;
  #boards: Board[];
  #permissions: Permission[];
  #settings: Settings | null;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    boards: Board[],
    permissions: Permission[],
    settings: Settings | null
  ) {
    this.#id = id;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#username = username;
    this.#password = password;
    this.#boards = boards;
    this.#permissions = permissions;
    this.#settings = settings;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get firstName() { return this.#firstName; }
  set firstName(value: string) { this.#firstName = value; }

  get lastName() { return this.#lastName; }
  set lastName(value: string) { this.#lastName = value; }

  get username() { return this.#username; }
  set username(value: string) { this.#username = value; }

  get password() { return this.#password; }
  set password(value: string) { this.#password = value; }

  get boards() { return this.#boards; }
  set boards(value: Board[]) { this.#boards = value; }

  get permissions() { return this.#permissions; }
  set permissions(value: Permission[]) { this.#permissions = value; }

  get preference() { return this.#settings; }
  set preference(value: Settings | null) { this.#settings = value; }
}
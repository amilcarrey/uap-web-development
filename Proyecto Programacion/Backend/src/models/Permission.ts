import { User } from './User';
import { Board } from './Board';

export enum PermissionLevel {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export class Permission {
  #id: number;
  #user: User;
  #board: Board;
  #level: PermissionLevel;

  constructor(id: number, user: User, board: Board, level: PermissionLevel) {
    this.#id = id;
    this.#user = user;
    this.#board = board;
    this.#level = level;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get user() { return this.#user; }
  set user(value: User) { this.#user = value; }

  get board() { return this.#board; }
  set board(value: Board) { this.#board = value; }

  get level() { return this.#level; }
  set level(value: PermissionLevel) { this.#level = value; }
}
import { Board } from './Board';

export class Task {
  #id: number;
  #board: Board;
  #content: string;
  #active: boolean;

  constructor(
    id: number,
    board: Board,
    content: string,
    active: boolean
  ) {
    this.#id = id;
    this.#board = board;
    this.#content = content;
    this.#active = active;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get board() { return this.#board; }
  set board(value: Board) { this.#board = value; }

  get content() { return this.#content; }
  set content(value: string) { this.#content = value; }

  get active() { return this.#active; }
  set active(value: boolean) { this.#active = value; }
}
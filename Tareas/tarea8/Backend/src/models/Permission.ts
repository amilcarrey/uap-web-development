export enum PermissionLevel {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export class Permission {
  #id: number;
  #userId: number;
  #boardId: number;
  #level: PermissionLevel;

  constructor(id: number, userId: number, boardId: number, level: PermissionLevel) {
    this.#id = id;
    this.#userId = userId;
    this.#boardId = boardId;
    this.#level = level;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get userId() { return this.#userId; }
  set userId(value: number) { this.#userId = value; }

  get boardId() { return this.#boardId; }
  set boardId(value: number) { this.#boardId = value; }

  get level() { return this.#level; }
  set level(value: PermissionLevel) { this.#level = value; }
}
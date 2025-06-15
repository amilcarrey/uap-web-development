import { User } from './User';
import { Permission } from './Permission';
import { Task } from './Task';

export class Board {
  #id: number;
  #name: string;
  #active: boolean; //El estado cambia cuando el usuaio lo selecciona
  #ownerId: number;
  #tasks: Task[];
  #permissions: Permission[];

  constructor(
    id: number,
    name: string,
    active: boolean,
    ownerId: number,
    tasks: Task[],
    permissions: Permission[]
  ) {
    this.#id = id;
    this.#name = name;
    this.#active = active;
    this.#ownerId = ownerId;
    this.#tasks = tasks;
    this.#permissions = permissions;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get name() { return this.#name; }
  set name(value: string) { this.#name = value; }

  get active() { return this.#active; }
  set active(value: boolean) { this.#active = value; }

  get ownerId() { return this.#ownerId; }
  set ownerId(value: number) { this.#ownerId = value; }

  get tasks() { return this.#tasks; }
  set tasks(value: Task[]) { this.#tasks = value; }

  get permissions() { return this.#permissions; }
  set permissions(value: Permission[]) { this.#permissions = value; }
}
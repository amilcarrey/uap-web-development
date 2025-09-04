import { User } from './User';

export class Settings {
  #id: number;
  #user: User;
  #itemsPerPage: number;
  #updateInterval: number;
  #upperCase: boolean;

  constructor(
    id: number,
    user: User,
    itemsPerPage: number,
    updateInterval: number,
    upperCase: boolean
  ) {
    this.#id = id;
    this.#user = user;
    this.#itemsPerPage = itemsPerPage;
    this.#updateInterval = updateInterval;
    this.#upperCase = upperCase;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get user() { return this.#user; }
  set user(value: User) { this.#user = value; }

  get itemsPerPage() { return this.#itemsPerPage; }
  set itemsPerPage(value: number) { this.#itemsPerPage = value; }

  get updateInterval() { return this.#updateInterval; }
  set updateInterval(value: number) { this.#updateInterval = value; }

  get upperCase() { return this.#upperCase; }
  set upperCase(value: boolean) { this.#upperCase = value; }
}
import { Tablero } from './Tablero';

export class Tarea {
  #id: number;
  #contenido: string;
  #estado: boolean;
  #tablero: Tablero;

  constructor(id: number, contenido: string, estado: boolean, tablero: Tablero) {
    this.#id = id;
    this.#contenido = contenido;
    this.#estado = estado;
    this.#tablero = tablero;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get contenido() { return this.#contenido; }
  set contenido(value: string) { this.#contenido = value; }

  get estado() { return this.#estado; }
  set estado(value: boolean) { this.#estado = value; }

  get tablero() { return this.#tablero; }
  set tablero(value: Tablero) { this.#tablero = value; }
}
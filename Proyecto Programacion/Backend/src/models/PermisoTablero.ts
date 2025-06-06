import { Usuario } from './Usuario';
import { Tablero } from './Tablero';

export enum NivelPermiso {
  propietatio = 'propietatio',
  editor = 'editor',
  lector = 'lector'
}

export class PermisoTablero {
  #id: number;
  #usuario: Usuario;
  #tablero: Tablero;
  #nivel: NivelPermiso;

  constructor(id: number, usuario: Usuario, tablero: Tablero, nivel: NivelPermiso) {
    this.#id = id;
    this.#usuario = usuario;
    this.#tablero = tablero;
    this.#nivel = nivel;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get usuario() { return this.#usuario; }
  set usuario(value: Usuario) { this.#usuario = value; }

  get tablero() { return this.#tablero; }
  set tablero(value: Tablero) { this.#tablero = value; }

  get nivel() { return this.#nivel; }
  set nivel(value: NivelPermiso) { this.#nivel = value; }
}
import { Usuario } from './Usuario';

export class Preferencia {
  #id: number;
  #usuario: Usuario;
  #elementosPorPagina: number;
  #intervaloActualizacion: number;
  #upperCaseAlias: boolean;

  constructor(id: number, usuario: Usuario, elementosPorPagina: number, intervaloActualizacion: number, upperCaseAlias: boolean) {
    this.#id = id;
    this.#usuario = usuario;
    this.#elementosPorPagina = elementosPorPagina;
    this.#intervaloActualizacion = intervaloActualizacion;
    this.#upperCaseAlias = upperCaseAlias;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get usuario() { return this.#usuario; }
  set usuario(value: Usuario) { this.#usuario = value; }

  get elementosPorPagina() { return this.#elementosPorPagina; }
  set elementosPorPagina(value: number) { this.#elementosPorPagina = value; }

  get intervaloActualizacion() { return this.#intervaloActualizacion; }
  set intervaloActualizacion(value: number) { this.#intervaloActualizacion = value; }

  get upperCaseAlias() { return this.#upperCaseAlias; }
  set upperCaseAlias(value: boolean) { this.#upperCaseAlias = value; }
}
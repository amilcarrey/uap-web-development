import { Tablero } from './Tablero';
import { PermisoTablero } from './PermisoTablero';
import { Preferencia } from './Preferencia';

export class Usuario {
  #id: number;
  #nombre: string;
  #apellido: string;
  #alias: string;
  #password: string;
  #tableros: Tablero[];
  #permisos: PermisoTablero[];
  #preferencia: Preferencia | null;

  constructor(
    id: number,
    nombre: string,
    apellido: string,
    alias: string,
    password: string,
    tableros: Tablero[],
    permisos: PermisoTablero[],
    preferencia: Preferencia | null
  ) {
    this.#id = id;
    this.#nombre = nombre;
    this.#apellido = apellido;
    this.#alias = alias;
    this.#password = password;
    this.#tableros = tableros;
    this.#permisos = permisos;
    this.#preferencia = preferencia;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get nombre() { return this.#nombre; }
  set nombre(value: string) { this.#nombre = value; }

  get apellido() { return this.#apellido; }
  set apellido(value: string) { this.#apellido = value; }

  get alias() { return this.#alias; }
  set alias(value: string) { this.#alias = value; }

  get password() { return this.#password; }
  set password(value: string) { this.#password = value; }

  get tableros() { return this.#tableros; }
  set tableros(value: Tablero[]) { this.#tableros = value; }

  get permisos() { return this.#permisos; }
  set permisos(value: PermisoTablero[]) { this.#permisos = value; }

  get preferencia() { return this.#preferencia; }
  set preferencia(value: Preferencia | null) { this.#preferencia = value; }
}
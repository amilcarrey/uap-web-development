import { Usuario } from './Usuario';
import { PermisoTablero } from './PermisoTablero';
import { Tarea } from './Tarea';

export class Tablero {
  #id: number;
  #nombre: string;
  #estado: boolean;
  #propietatio: Usuario;
  #tareas: Tarea[];
  #permisos: PermisoTablero[];

  constructor(id: number, nombre: string, estado: boolean, propietatio: Usuario, tareas: Tarea[], permisos: PermisoTablero[]) {
    this.#id = id;
    this.#nombre = nombre;
    this.#estado = estado;
    this.#propietatio = propietatio;
    this.#tareas = tareas;
    this.#permisos = permisos;
  }

  get id() { return this.#id; }
  set id(value: number) { this.#id = value; }

  get nombre() { return this.#nombre; }
  set nombre(value: string) { this.#nombre = value; }

  get estado() { return this.#estado; }
  set estado(value: boolean) { this.#estado = value; }

  get propietatio() { return this.#propietatio; }
  set propietatio(value: Usuario) { this.#propietatio = value; }

  get tareas() { return this.#tareas; }
  set tareas(value: Tarea[]) { this.#tareas = value; }

  get permisos() { return this.#permisos; }
  set permisos(value: PermisoTablero[]) { this.#permisos = value; }
}
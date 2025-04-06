  /**
   * Global state object for task manager
   * @type {Object}
   * @property {Array} tasks - List of tasks
   */
  // src/state.js

  //aqui manejamos tareas precargadas y los estados de las mismas para los filtros
  export const state = {
    filter: "all",
    tasks: [
      { id: 123, text: "Ir al gym", completed: false },
      { id: 124, text: "Jugar fútbol", completed: false },
      { id: 125, text: "Viajar a Ecuador", completed: false },
      { id: 126, text: "Comprar en el Ceape", completed: false }
    ]
  };

export class TareaList extends HTMLElement {
    private lista: HTMLUListElement | null = null;
    private template: HTMLTemplateElement | null = null;
    private filtro: "todas" | "completas" | "incompletas" = "todas";
  
    connectedCallback() {
      this.lista = this.querySelector("ul");
      this.template = document.getElementById("tarea-template") as HTMLTemplateElement;
  
      if (!this.lista || !this.template) {
        console.error("❌ No se encontró la lista o el template.");
        return;
      }
  
      document.querySelectorAll(".filtro").forEach(btn => {
        btn.addEventListener("click", () => {
          this.filtro = btn.getAttribute("data-filtro") as typeof this.filtro;
          this.cargarTareas();
        });
      });
  
      document.getElementById("btn-limpiar")?.addEventListener("click", async () => {
        await fetch("/api/tareas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "limpiar" }),
        });
        this.cargarTareas();
      });
  
      this.cargarTareas();
    }
  
    async cargarTareas() {
      const res = await fetch("/api/tareas-data");
      const tareas = await res.json();
      if (!Array.isArray(tareas)) return;
  
      this.lista!.innerHTML = "";
      tareas
        .filter(t =>
          this.filtro === "completas" ? t.completada :
          this.filtro === "incompletas" ? !t.completada :
          true
        )
        .forEach(t => this.renderTarea(t));
    }
  
    renderTarea(tarea: any) {
      const clone = this.template!.content.cloneNode(true) as HTMLElement;
      const li = clone.querySelector("li")!;
      const btnToggle = clone.querySelector("[data-toggle]") as HTMLButtonElement;
      const span = clone.querySelector("span")!;
      const btnBorrar = clone.querySelector("[data-borrar]") as HTMLButtonElement;
  
      btnToggle.textContent = tarea.completada ? "✔️" : "";
      span.textContent = tarea.texto;
  
      if (tarea.completada) {
        btnToggle.classList.add("bg-green-100", "text-green-700", "border-green-500");
        span.classList.add("line-through", "text-gray-400");
      }
  
      btnToggle.addEventListener("click", async () => {
        await fetch("/api/tareas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "toggle", id: tarea.id }),
        });
        this.cargarTareas();
      });
  
      btnBorrar.addEventListener("click", async () => {
        await fetch("/api/tareas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "borrar", id: tarea.id }),
        });
        li.remove();
      });
  
      this.lista?.appendChild(clone);
    }
  }
  
  customElements.define("tarea-list", TareaList);
  
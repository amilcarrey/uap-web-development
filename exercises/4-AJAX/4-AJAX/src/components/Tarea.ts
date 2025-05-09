import type { Tarea } from "../types";

  console.log("hola")

  export class TareaItem extends HTMLElement {
    private li: HTMLLIElement | null = null;
    private toggleButton: HTMLButtonElement | null = null;
    private deleteButton: HTMLButtonElement | null = null;
    private contentElement: HTMLElement | null = null;

    private tareaId: string | undefined;

    connectedCallback() {
      this.li = this.querySelector("li")!;
      this.toggleButton = this.querySelector<HTMLButtonElement>("[data-action-button='toggle-button']")!;
      this.deleteButton = this.querySelector<HTMLButtonElement>("[data-action-button='delete-button']")!;
      this.contentElement = this.querySelector<HTMLElement>("[data-content='content']")!;
      this.tareaId = this.li.dataset.id;

      this.toggleButton.addEventListener("click", this.handleToggle);
      this.deleteButton.addEventListener("click", this.handleDelete);
    }

    setId(id: string) {
      if (!this.li) throw new Error();
      this.li.dataset["id"] = id;
      this.tareaId = id;
    }

    setContent(content: string) {
      if (!this.contentElement) throw new Error();
      this.contentElement.textContent = content;
    }

    setCompleted(completed: boolean) {
      if (!this.toggleButton) throw new Error();
      this.toggleButton.textContent = completed ? "✅" : "⬜";
    }

    handleToggle = async (e: MouseEvent) => {
      e.preventDefault();//evita que se envie el form
      const id = this.tareaId;

      const response = await fetch(`/api/tareas/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "toggle" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: { success: boolean; tarea: Tarea } = await response.json();
      if (data.success) {
        this.setCompleted(data.tarea.completed);
      }
    };

    handleDelete = async (e: MouseEvent) => {
      e.preventDefault();
      const id = this.tareaId;

      const response = await fetch(`/api/tareas/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "delete" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: { success: boolean } = await response.json();
      if (data.success) {
        this.remove();
      }
    };
  }

  customElements.define("tarea-item", TareaItem);
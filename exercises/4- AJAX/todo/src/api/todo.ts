import {
  getTareas,
  addTarea,
  updateTarea,
  deleteTarea,
} from "../scripts/todo2";

export async function GET() {
  const tareas = await getTareas();
  return new Response(JSON.stringify(tareas), { status: 200 });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");

  const content =
    contentType === "application/json"
      ? await request.json().then((data) => data.texto as string)
      : await request.formData().then((data) => data.get("texto")?.toString());

  if (!content) {
    return new Response("Texto es requerido", { status: 400 });
  }

  const tarea = await addTarea(content.toString());

  if (contentType === "application/json") {
    return new Response(JSON.stringify({ success: true, tarea }), {
      status: 200,
    });
  }
  return new Response(JSON.stringify(tarea), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: Request) {
  const contentType = request.headers.get("content-type");
  let id: number, status: boolean;

  if (contentType === "application/json") {
    const { id: tareaId, completada } = await request.json();
    id = tareaId;
    status = completada;
  } else {
    const formData = await request.formData();
    id = parseInt(formData.get("id")?.toString() || "0");
    status = formData.get("completada") === "true";
  }

  if (!id) {
    return new Response("ID es requerido", { status: 400 });
  }
  if (status === undefined) {
    return new Response("Estado es requerido", { status: 400 });
  }
  if (id && status) {
    updateTarea(id, status);
  }
  return new Response(null, {
    status: 303,
    headers: { Location: "/" },
  });
}

export async function DELETE(request: Request) {
  const contentType = request.headers.get("content-type");
  let id: number;
  if (contentType === "application/json") {
    const data = await request.json();
    id = parseInt(data.id);
  } else {
    const formData = await request.formData();
    id = parseInt(formData.get("id")?.toString() || "0");
  }
  await deleteTarea(id);
  return new Response(null, {
    status: 303,
    headers: { Location: "/" },
  });
}

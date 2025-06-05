import type { APIRoute } from "astro";

let settings = {
  refetchInterval: 10000,
  uppercaseDescriptions: false
}

export const GET: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  try {
    if (contentType === "application/json") {
      return new Response(
        JSON.stringify(settings), {
        status: 200,
        headers: { "Content-Type": "application/json"},
      });
    }
    
    return redirect("/");

  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");

  try {
    const body = await request.json();

    if (typeof body.refetchInterval === "number" && typeof body.uppercaseDescriptions === "boolean") {
      settings = {
        refetchInterval: body.refetchInterval,
        uppercaseDescriptions: body.uppercaseDescriptions,
      };
    }

    if (contentType === "application/json") {
      return new Response(JSON.stringify(settings), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return redirect("/");
  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};
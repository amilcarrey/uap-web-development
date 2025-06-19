import type { APIRoute } from "astro";
import { boards } from "../../lib/boards.ts";

export const GET: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");
    
  try {
    if (contentType === "application/json") {
    return new Response(JSON.stringify(boards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
    
  return redirect("/");
    
  } catch (error) {
    return new Response("Invalid content type", { status: 400 });
  }
};
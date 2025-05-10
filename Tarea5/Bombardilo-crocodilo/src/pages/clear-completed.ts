import type { APIRoute } from "astro";
import { state } from "./state";

export const POST: APIRoute = async () => {
	state.tasks = state.tasks.filter((t) => !t.completed);
	return new Response(
		JSON.stringify({ success: true }),
		{ headers: { "Content-Type": "application/json" } }
	);
};

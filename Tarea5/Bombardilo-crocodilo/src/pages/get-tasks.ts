import type { APIRoute } from "astro";
import { state } from "./state";

export const GET: APIRoute = ({ url }) => {
	const filter = url.searchParams.get("filter");

	let filtered = state.tasks;

	if (filter === "completed") {
		filtered = state.tasks.filter((t) => t.completed);
	} else if (filter === "active") {
		filtered = state.tasks.filter((t) => !t.completed);
	}

	return new Response(JSON.stringify(filtered), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};

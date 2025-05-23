import { getTasks } from '../../lib/tasks.js';

export async function GET({ url }) {
  const status = url.searchParams.get("status") || "all";
  const filtered = getTasks(status);

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
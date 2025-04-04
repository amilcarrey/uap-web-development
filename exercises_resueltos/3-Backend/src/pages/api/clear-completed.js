
import { clearCompleted } from '../../tasks.js';

export async function POST() {
  clearCompleted();
  return new Response(null, {
    status: 303,
    headers: { Location: '/' }
  });
}

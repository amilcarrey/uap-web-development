import { streamText } from 'ai';
import { client } from '../ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages)

  const result = streamText({
    model: client('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toUIMessageStreamResponse();
}

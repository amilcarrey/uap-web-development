import { Configuration, OpenAIApi } from 'openai-edge';
import { convertToModelMessages } from 'ai';

// Configurar OpenAI con la API Key desde las variables de entorno
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Usar la clave de OpenAI directamente
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    // Validar que la API Key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('La API Key de OpenAI no está configurada.');
    }

    // Parsear los mensajes enviados desde el cliente
    const { messages }: { messages: { role: string; content: string }[] } = await req.json();

    // Mapear y truncar mensajes para optimizar el uso de tokens
    const formattedMessages = messages.map((message) => ({
      role: message.role as 'system' | 'user' | 'assistant', // Cast explícito del rol
      content: message.content.slice(0, 1000), // Limitar el contenido a 1000 caracteres
      parts: [{ content: message.content.slice(0, 1000) }], // Agregar 'parts' con contenido correctamente tipado
    }));

    // Crear una solicitud al modelo de OpenAI
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Cambiar a un modelo más económico si es necesario
      messages: convertToModelMessages(formattedMessages)
        .filter((message) => ['system', 'user', 'assistant'].includes(message.role as string)) // Filtrar roles válidos
        .map((message) => ({
          role: message.role as 'system' | 'user' | 'assistant', // Cast explícito del rol
          content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
        })),
      stream: true, // Habilitar streaming para respuestas en tiempo real
    });

    // Retornar la respuesta en streaming
    return new Response(response.body, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error en la solicitud:', error);

    // Manejo de errores específicos
    if (error instanceof Error && error.message.includes('insufficient_quota')) {
      return new Response(
        JSON.stringify({
          error: {
            message: 'Has excedido tu cuota actual. Por favor, revisa tu plan y detalles de facturación.',
            type: 'insufficient_quota',
          },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          message: 'Error interno del servidor. Por favor, intenta nuevamente más tarde.',
          type: 'server_error',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
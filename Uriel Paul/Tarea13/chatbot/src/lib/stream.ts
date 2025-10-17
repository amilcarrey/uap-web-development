interface OpenRouterStreamDelta {
  content?: string | null;
}

interface OpenRouterStreamChoice {
  delta?: OpenRouterStreamDelta;
  message?: { content?: string | null };
}

interface OpenRouterStreamChunk {
  choices?: OpenRouterStreamChoice[];
}

function extractContentFromChunk(chunk: OpenRouterStreamChunk): string | undefined {
  if (!chunk.choices || chunk.choices.length === 0) {
    return undefined;
  }

  const [choice] = chunk.choices;
  return (
    choice.delta?.content ??
    choice.message?.content ??
    undefined
  );
}

function parseEventData(eventData: string): string | undefined {
  if (!eventData || eventData === '[DONE]') {
    return undefined;
  }

  try {
    const parsed = JSON.parse(eventData) as OpenRouterStreamChunk;
    return extractContentFromChunk(parsed);
  } catch (error) {
    console.error('No fue posible interpretar un fragmento del stream de OpenRouter.', error);
    return undefined;
  }
}

export function transformOpenRouterStream(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let isCancelled = false;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      reader = source.getReader();
      let buffer = '';
      let isClosed = false;
      let shouldCancelReader = false;

      const closeController = () => {
        if (!isClosed) {
          isClosed = true;
          controller.close();
        }
      };

      const processBuffer = (flushRemaining = false): boolean => {
        if (!buffer) {
          return false;
        }

        const segments = buffer.split(/\r?\n\r?\n/);
        if (!flushRemaining) {
          buffer = segments.pop() ?? '';
        } else {
          buffer = '';
        }

        for (const segment of segments) {
          const dataLines = segment
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice('data:'.length).trim());

          if (dataLines.length === 0) {
            continue;
          }

          const joinedData = dataLines.join('\n');

          if (joinedData === '[DONE]') {
            closeController();
            shouldCancelReader = true;
            return true;
          }

          const content = parseEventData(joinedData);
          if (content && !isCancelled && !isClosed) {
            controller.enqueue(encoder.encode(content));
          }
        }

        return false;
      };

      const pump = async () => {
        if (!reader) {
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              buffer += decoder.decode();
              const shouldStop = processBuffer(true);
              if (!shouldStop) {
                closeController();
              }
              break;
            }

            if (value) {
              buffer += decoder.decode(value, { stream: true });
              const shouldStop = processBuffer();
              if (shouldStop) {
                break;
              }
            }
          }
        } catch (error) {
          if (!isCancelled) {
            controller.error(error);
          }
        } finally {
          if (reader) {
            try {
              if (shouldCancelReader) {
                await reader.cancel();
              }
            } catch (error) {
              console.warn('No fue posible cancelar la lectura del stream.', error);
            } finally {
              reader.releaseLock();
              reader = null;
            }
          }
        }
      };

      pump().catch((error) => {
        if (!isCancelled) {
          controller.error(error);
        }
      });
    },
    async cancel(reason) {
      isCancelled = true;
      if (reader) {
        try {
          await reader.cancel(reason);
        } catch (error) {
          console.warn('No fue posible cancelar el stream origen.', error);
        } finally {
          reader.releaseLock();
          reader = null;
        }
      }
    },
  });
}

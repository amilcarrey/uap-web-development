'use client';

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
}

export function ChatInput({ isLoading, onSubmit }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = input.value.trim();
    
    if (message) {
      onSubmit(message);
      form.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-4">
        <input
          type="text"
          name="message"
          placeholder="Escribe un mensaje..."
          disabled={isLoading}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
}
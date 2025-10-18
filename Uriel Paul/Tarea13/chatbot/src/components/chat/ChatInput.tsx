'use client';

import { FormEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled = false }: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  const isSubmitDisabled = disabled || !value.trim();
  const isLoading = Boolean(disabled);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:flex-row sm:items-end"
    >
      <label className="flex-1">
        <span className="sr-only">Escribe tu mensaje</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Escribe un mensaje..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="inline-flex min-w-[6rem] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            Enviando
          </>
        ) : (
          'Enviar'
        )}
      </button>
    </form>
  );
}

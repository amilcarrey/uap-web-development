// src/components/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient()); // ✅ solo se crea del lado cliente

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

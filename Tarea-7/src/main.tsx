// src/main.tsx (o donde tengas este archivo)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import App from './App.tsx'

export default function RootApp() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

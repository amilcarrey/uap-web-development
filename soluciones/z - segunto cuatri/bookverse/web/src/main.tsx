import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import SearchPage from './pages/SearchPage'
import BookDetailPage from './pages/BookDetailPage'


const qc = new QueryClient()
const router = createBrowserRouter([
{ path: '/', element: <App />, children: [
{ index: true, element: <SearchPage /> },
{ path: 'book/:id', element: <BookDetailPage /> }
]}
])


createRoot(document.getElementById('root')!).render(
<StrictMode>
<QueryClientProvider client={qc}>
<RouterProvider router={router} />
</QueryClientProvider>
</StrictMode>
)
// import { Provider } from 'react-redux'
// import { store } from './store/store'
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { RouterProvider } from "@tanstack/react-router";
// import { router } from "./router";

// const queryClient = new QueryClient();

// createRoot(document.getElementById('root')!).render(
//   // <StrictMode>
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//         <RouterProvider router={router} />
//         <ReactQueryDevtools initialIsOpen={false} />
//       </QueryClientProvider>
//     </Provider>
//   // </StrictMode>
// )


// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { RouterProvider } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext' 
// import { router } from './router' 
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <RouterProvider router={router} />
//     </AuthProvider>
//   </React.StrictMode>,
// )

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { store } from './store/store'
import { AuthProvider } from './context/AuthContext'
import { router } from './router'
import './index.css'

// ✅ Crear el QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Solo reintentar 1 vez en caso de error
      refetchOnWindowFocus: false, // No refetch cuando la ventana gana foco
      staleTime: 1000 * 60 * 5, // 5 minutos antes de considerar datos obsoletos
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          {/* ✅ DevTools para desarrollo */}
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
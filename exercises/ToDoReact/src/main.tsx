import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import "./styles/index.css";
import { router } from "./router";


//CONFIGURATION OF REACT QUERY TO HANDLE DATA FETCHING AND MUTATIONS
// It sets default options for queries and mutations, including stale time, retry logic, and error handling.
//IA HELPED ME TO COMPREHEND THIS BETTER
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

//RENDERING THE APPLICATION. INSTEAD OF HAVING IT IN THE APP COMPONENT, IT'S NOW IN THE MAIN ENTRY POINT. WITH ALL THE PROVIDERS AND THE ROUTER SETUP.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

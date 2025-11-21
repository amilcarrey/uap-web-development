import { useQuery } from "@tanstack/react-query";
import { findBooks, fetchBookDetails } from "@/services/booksService";

export function useBookSearch(query: string) {
  return useQuery({
    queryKey: ["books", query],
    queryFn: () => findBooks(query),
    enabled: !!query,
  });
}

export function useBookDetails(id: string) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookDetails(id),
    enabled: !!id,
  });
}
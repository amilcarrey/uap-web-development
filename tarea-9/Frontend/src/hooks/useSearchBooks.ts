import { useState } from "react";
import { api } from "../api/client";

export const useSearchBooks = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (q: string) => {
  setLoading(true);
  try {
    const res = await api.get(`/books?q=${encodeURIComponent(q)}`);
    console.log(res.data); // <--- chequea qué viene del backend
    setResults(res.data);
  } catch (err) {
    console.error(err);
    setResults([]);
  } finally {
    setLoading(false);
  }
};

  return { results, search, loading };
};

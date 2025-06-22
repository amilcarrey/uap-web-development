import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useLiveSearch = (initialValue = '', delay = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  const debouncedSetSearch = useDebouncedCallback(
    (value) => {
      setDebouncedSearchTerm(value);
    },
    delay
  );

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  return {
    searchTerm,           // Valor actual del input
    debouncedSearchTerm,  // Valor debounced para usar en filtros
    handleSearchChange,   // Función para cambiar el valor
    handleSearchClear     // Función para limpiar la búsqueda
  };
}; 
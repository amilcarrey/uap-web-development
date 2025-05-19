// Importamos los hooks useState y useEffect desde React
import { useState, useEffect } from "react";

// Definimos y exportamos el hook personalizado useDebounce
// Este hook recibe un valor (value) y un tiempo de espera (delay), y devuelve el valor después de que haya pasado ese tiempo sin que cambie
export function useDebounce(value: string, delay: number = 500) {
  // Estado que guarda el valor "debounced", es decir, el valor final después de esperar el delay
  const [debouncedValue, setDebouncedValue] = useState(value);

  // useEffect se ejecuta cada vez que cambian el valor original o el delay
  useEffect(() => {
    // Establecemos un temporizador que actualizará el valor "debounced" después del delay indicado
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    // Esta función de limpieza se ejecuta si el efecto se vuelve a ejecutar antes de que termine el timeout,
    // lo que cancela el temporizador anterior. Así evitamos actualizar el valor si se está tipeando rápidamente.
    return () => clearTimeout(timeout);
  }, [value, delay]); // Dependencias del efecto: se vuelve a ejecutar cuando cambia 'value' o 'delay'

  // Devolvemos el valor debounced (actualizado solo si no se cambió por un tiempo)
  return debouncedValue;
}

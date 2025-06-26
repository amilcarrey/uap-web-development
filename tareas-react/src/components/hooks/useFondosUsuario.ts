import { useEffect, useState } from "react";
import axios from "axios";

type Fondo = { id: string | number; url: string } | string;

export function useFondosUsuario() {
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [loadingFondos, setLoadingFondos] = useState(true);

  useEffect(() => {
    setLoadingFondos(true);
    axios
      .get("http://localhost:8008/api/fondos", { withCredentials: true })
      .then((res) => setFondos(res.data.fondos ?? []))
      .catch(() => setFondos([]))
      .finally(() => setLoadingFondos(false));
  }, []);

  return { fondos, setFondos, loadingFondos };
}
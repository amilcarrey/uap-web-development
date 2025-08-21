"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SearchForm({ initialQuery }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery || "");
  const router = useRouter();

  function go() {
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Título, autor o ISBN…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
      />
      <Button onClick={go}>Buscar</Button>
    </div>
  );
}
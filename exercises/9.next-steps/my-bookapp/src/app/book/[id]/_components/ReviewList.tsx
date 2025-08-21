'use client'
import { useEffect,useState, useTransition } from "react";
import { voteReview } from "../actions";
import { useRouter } from "next/navigation";

type Review = { id: string; volumeId: string; rating: number; text: string; votes: number };

export default function ReviewList({ volumeId, initial }: { volumeId: string; initial: Review[] }) {
  const [items, setItems] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

    useEffect(() => {
    setItems(initial);
  }, [initial]);


  const vote = (id: string, delta: 1 | -1) => {
    setItems(arr => arr.map(r => r.id === id ? { ...r, votes: r.votes + delta } : r)); // optimista
    startTransition(async () => {
      await voteReview(volumeId, id, delta);
      router.refresh(); // obtener orden/votos reales
    });
  };

  if (!items.length) return <p className="text-neutral-400">Sé el primero en reseñar.</p>;

  return (
    <ul className="grid gap-2">
      {items
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map(r => (
          <li key={r.id} className="rounded border border-neutral-800 p-3">
            <div className="text-sm text-neutral-400">⭐ {r.rating} / 5</div>
            <p className="mt-1">{r.text}</p>
            <div className="mt-2 flex items-center gap-2">
              <button onClick={() => vote(r.id, 1)} disabled={isPending} className="rounded border border-neutral-700 px-2 py-1 text-sm">👍</button>
              <button onClick={() => vote(r.id, -1)} disabled={isPending} className="rounded border border-neutral-700 px-2 py-1 text-sm">👎</button>
              <span className="text-sm text-neutral-400">votos: {r.votes}</span>
            </div>
          </li>
        ))}
    </ul>
  );
}

import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(5).max(2000),
  createdAt: z.number(),
  up: z.number().default(0),
  down: z.number().default(0),
});
export type Review = z.infer<typeof ReviewSchema>;

const KEY = (volumeId: string) => `reviews:${volumeId}`;
const VOTEKEY = (reviewId: string) => `vote:${reviewId}`;

export function getReviews(volumeId: string): Review[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY(volumeId));
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown[];
    return arr.map((r) => ReviewSchema.parse(r));
  } catch {
    return [];
  }
}

export function saveReviews(volumeId: string, reviews: Review[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY(volumeId), JSON.stringify(reviews));
}

export function createReview(volumeId: string, data: { rating: number; content: string }) {
  const all = getReviews(volumeId);
  const r: Review = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()),
    rating: data.rating,
    content: data.content,
    createdAt: Date.now(),
    up: 0,
    down: 0,
  };
  all.unshift(r);
  saveReviews(volumeId, all);
  return r;
}

export function voteReview(volumeId: string, reviewId: string, delta: 1 | -1) {
  const all = getReviews(volumeId);
  const idx = all.findIndex((r) => r.id === reviewId);
  if (idx === -1) return;

  const mark = localStorage.getItem(VOTEKEY(reviewId)); // "1" | "-1" | null

  if (!mark) {
    if (delta === 1) all[idx].up += 1; else all[idx].down += 1;
    localStorage.setItem(VOTEKEY(reviewId), String(delta));
  } else if (Number(mark) === delta) {
    if (delta === 1) all[idx].up = Math.max(0, all[idx].up - 1);
    else all[idx].down = Math.max(0, all[idx].down - 1);
    localStorage.removeItem(VOTEKEY(reviewId));
  } else {
    if (delta === 1) { all[idx].up += 1; all[idx].down = Math.max(0, all[idx].down - 1); }
    else { all[idx].down += 1; all[idx].up = Math.max(0, all[idx].up - 1); }
    localStorage.setItem(VOTEKEY(reviewId), String(delta));
  }

  saveReviews(volumeId, all);
}

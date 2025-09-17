import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { locales } from "validator/lib/isIBAN"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
import { searchBooks, getBookById } from "@/lib/googleBooks";

export async function findBooks(query: string) {
    const data = await searchBooks(query);
    return data.items || [];
}

export async function fetchBookDetails(id: string) {
    return await getBookById(id);
}
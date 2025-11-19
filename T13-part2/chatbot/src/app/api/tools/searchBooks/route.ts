import { NextResponse } from "next/server";
import { searchBooks } from "@/lib/searchBooks"; 

export async function POST(req: Request) {
  try {
    const params = await req.json();
    const books = await searchBooks(params);
    return NextResponse.json({ books });
  } catch (error) {
    console.error("❌ Error in searchBooks route:", error);
    return NextResponse.json({ error: "Error fetching books" }, { status: 500 });
  }
}

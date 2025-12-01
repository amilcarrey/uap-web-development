// /readest/src/app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
  const data = await res.json();

  return NextResponse.json(data);
}

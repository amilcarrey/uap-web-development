import { NextResponse } from "next/server";
import { addToReadingListFn } from "@/lib/addToReadingList";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await addToReadingListFn(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error in addToReadingList route:", error);
    return NextResponse.json({ error: "Error adding book to reading list" }, { status: 500 });
  }
}

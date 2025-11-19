import { NextResponse } from "next/server";
import { getReadingList } from "@/lib/getReadingList";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await getReadingList(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error in getReadingList route:", error);
    return NextResponse.json({ error: "Error retrieving reading list" }, { status: 500 });
  }
}

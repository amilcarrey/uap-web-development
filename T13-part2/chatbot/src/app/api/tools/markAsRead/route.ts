import { NextResponse } from "next/server";
import { markAsReadFn } from "@/lib/markAsRead";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await markAsReadFn(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error in markAsRead route:", error);
    return NextResponse.json({ error: "Error marking book as read" }, { status: 500 });
  }
}

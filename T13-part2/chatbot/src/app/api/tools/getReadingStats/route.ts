import { NextResponse } from "next/server";
import { getReadingStatsFn } from "@/lib/getReadingStats";

// GET para obtener estadísticas desde el panel lateral
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "demo-user";
    const period = (searchParams.get("period") || "all-time") as "all-time" | "year" | "month" | "week";
    
    const result = await getReadingStatsFn({ userId, period });
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error in getReadingStats GET route:", error);
    return NextResponse.json({ error: "Error getting reading stats" }, { status: 500 });
  }
}

// POST para cuando se invoca como tool desde el chat
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await getReadingStatsFn(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error in getReadingStats POST route:", error);
    return NextResponse.json({ error: "Error getting reading stats" }, { status: 500 });
  }
}

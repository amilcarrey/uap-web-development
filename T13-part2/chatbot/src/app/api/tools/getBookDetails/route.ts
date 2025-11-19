// src/app/api/tools/getBookDetails/route.ts
import { NextResponse } from "next/server";
import { getBookDetails } from "@/lib/getBookDetails";

export async function POST(req: Request) {
  try {
    const { bookId } = await req.json();
    const book = await getBookDetails({ bookId });
    return NextResponse.json(book);
  } catch (error) {
    console.error("❌ Error en getBookDetails:", error);
    return NextResponse.json({ error: "Error al obtener detalles del libro" }, { status: 500 });
  }
}

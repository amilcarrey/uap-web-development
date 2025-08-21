import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const resenasPath = path.join(process.cwd(), 'data', 'resenas.json');

// Helper para asegurar que el archivo y carpeta existen
async function ensureFileExists(filePath: string) {
    const dir = path.dirname(filePath);
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch {}
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, '[]');
    }
}

// get para obtener reseñas
export async function GET() {
    await ensureFileExists(resenasPath);
    const data = await fs.readFile(resenasPath, 'utf-8');
    let resenas;
    try {
        resenas = JSON.parse(data);
    } catch {
        resenas = [];
    }
    return NextResponse.json(resenas);
}

// post para agregar una reseña
export async function POST(request: Request) {
    await ensureFileExists(resenasPath);
    const newReseña = await request.json();
    console.log("Nueva reseña:", newReseña);
    console.log("Ruta del JSON:", resenasPath);

    let resenas;
    try {
        const data = await fs.readFile(resenasPath, 'utf-8');
        resenas = JSON.parse(data);
        if (!Array.isArray(resenas)) resenas = [];
    } catch {
        resenas = [];
    }
    resenas.push(newReseña);

    // para guardar la reseña en el archivo
    await fs.writeFile(resenasPath, JSON.stringify(resenas, null, 2));
    console.log("Reseña guardada!");

    return NextResponse.json({ mensaje: "Reseña agregada", resenas: newReseña }); 
}
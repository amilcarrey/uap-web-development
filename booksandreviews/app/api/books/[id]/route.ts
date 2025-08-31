import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('API: Recibida petición para book ID:', id);
    
    if (!id) {
      console.log('API: Error - ID no proporcionado');
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
    console.log('API: Haciendo fetch a Google Books API:', url);
    const res = await fetch(url, { cache: 'no-store' });
    
    console.log('API: Google Books API response status:', res.status);
    
    if (!res.ok) {
      console.log('API: Error - Google Books API no encontró el libro');
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const data = await res.json();
    console.log('API: Datos recibidos de Google Books API:', { id: data.id, title: data.volumeInfo?.title });
    
    // Mapear los datos a nuestro formato
    const info = data.volumeInfo || {};
    const imageLinks = info.imageLinks || {};
    
    const book = {
      id: data.id,
      title: info.title || 'Título desconocido',
      authors: info.authors || [],
      thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || undefined,
      description: info.description,
      publishedDate: info.publishedDate,
      pageCount: info.pageCount,
      categories: info.categories || [],
      publisher: info.publisher,
      language: info.language,
    };

    console.log('API: Retornando libro mapeado:', { id: book.id, title: book.title });
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

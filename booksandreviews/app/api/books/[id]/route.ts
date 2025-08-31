import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const data = await res.json();
    
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

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

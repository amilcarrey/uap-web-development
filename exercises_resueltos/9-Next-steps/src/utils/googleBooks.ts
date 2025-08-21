import { Book, GoogleBooksResponse } from '@/types';

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching books');
    }
    
    const data: GoogleBooksResponse = await response.json();
    
    if (!data.items) {
      return [];
    }
    
    return data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      imageLinks: item.volumeInfo.imageLinks,
      categories: item.volumeInfo.categories,
      pageCount: item.volumeInfo.pageCount,
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
      industryIdentifiers: item.volumeInfo.industryIdentifiers
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching book details');
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      title: data.volumeInfo.title,
      authors: data.volumeInfo.authors,
      publishedDate: data.volumeInfo.publishedDate,
      description: data.volumeInfo.description,
      imageLinks: data.volumeInfo.imageLinks,
      categories: data.volumeInfo.categories,
      pageCount: data.volumeInfo.pageCount,
      averageRating: data.volumeInfo.averageRating,
      ratingsCount: data.volumeInfo.ratingsCount,
      industryIdentifiers: data.volumeInfo.industryIdentifiers
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
};
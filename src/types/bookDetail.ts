export interface BookDetail {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    imageLinks?: {
      thumbnail?: string
      large?: string
    }
  }
}
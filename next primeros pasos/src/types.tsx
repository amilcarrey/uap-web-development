export type bookss = 
{
    items: libro[]
}

export type volumeInfo = 
{
    authors: string[],
    categories: string[],
    title: string,
    pageCount: number, 
    imageLinks: {smallThumbnail: string, thumbnail: string}, 
    description: string,
    publishedDate: string,
    publisher: string,
}

export type libro = 
{
    id: string
    volumeInfo: volumeInfo
}


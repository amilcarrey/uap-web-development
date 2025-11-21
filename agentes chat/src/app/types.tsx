import { MessageItem } from "./ChatComponent"

export interface Message {
    id?: string, 
    messageContent: string,
    transmitter: 'server' | 'client'
}

export interface MessageItemProps {
    message: Message
}

export type libro = 
{
    id: string
    volumeInfo: volumeInfo
}

export type libroInfoBasica = {
    ID: string,
    titulo: string,
    autor: string[],
    thumbnail: string
}

export type volumeInfo = 
{
    authors: string[],
    categories: string[],
    title: string,
    pageCount: number, 
    imageLinks: {
        smallThumbnail: string, 
        thumbnail: string,
        small: string, 
        medium: string, 
        large: string, 
        extraLarge: string
    }, 
    description: string,
    publishedDate: string,
    publisher: string,
}
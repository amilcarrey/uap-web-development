import { MessageItem } from "./ChatComponent"

export interface Message {
    id?: string, 
    messageContent: string,
    transmitter: 'server' | 'client'
}

export interface MessageItemProps {
    message: Message
}
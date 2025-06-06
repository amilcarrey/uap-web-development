import { Message, CreateMessageRequest } from "../../types";
import { MessageRepository } from "./message.repository";

export class MessageService 
{
    constructor(private readonly messageRepository: MessageRepository) {}

    async getAllMessages(): Promise<Message[]>{
        return 
    }
}
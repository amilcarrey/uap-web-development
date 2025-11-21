import { atom } from "jotai";
import { Message } from "./types";

export const chatAtom = atom<Message[]>([
    {
        messageContent: 'prueba 1',
        transmitter: 'client'
    },
    {
        messageContent: 'prueba 1',
        transmitter: 'server'
    }
])
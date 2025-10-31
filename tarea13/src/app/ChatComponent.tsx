import { useAtomValue } from "jotai"
import { Message, MessageItemProps } from "./types"
import { chatAtom } from "./store"
import { useChat } from '@ai-sdk/react'
import { useState } from "react"

export default function ChatComponent() {
    const chat = useAtomValue(chatAtom)
    console.log(chat)

    return (
        <>
            <div className="h-full text-center text-white ">
                {
                    // show messages when there are any; otherwise show placeholder
                    chat.length !== 0 ? (
                        chat.map((m) => {
                            return <MessageItem message={m} key={m.id}></MessageItem>
                        })
                    ) : (
                        <h2 className="text-center text-4xl text-pretty">Confirma la copia!</h2>
                    )
                }
            </div>
        </>
    )
}

export function MessageItem({ message }: MessageItemProps) {
    return (<>
        {message.transmitter == 'client' ?
            <div className="p-2 flex justify-end w-full">
                <div className="rounded-md bg-[#466946] p-1.5 text-white">
                    <p>{message.messageContent}</p>
                </div>
            </div>
            :
            <div className="p-2 flex justify-baseline w-full">
                <div className="rounded-md bg-[#3f483f] p-1.5 text-white">
                    <p>{message.messageContent}</p>
                </div>
            </div>
        }
    </>)
}

export function ChatHook() {
    const { messages, status, sendMessage } = useChat()
    const [input, setInput] = useState('');
    const handleSubmit = (e: any) => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
    };

    return (
        <div>
            {messages.map(message => (
                <div key={message.id}>
                    <strong>{`${message.role}: `}</strong>
                    {message.parts.map((part, index) => {
                        switch (part.type) {
                            case 'text':
                                return <span key={index}>{part.text}</span>;

                            // other cases can handle images, tool calls, etc
                        }
                    })}
                </div>
            ))}

            <form onSubmit={handleSubmit}>
                <input
                    value={input}
                    placeholder="Send a message..."
                    onChange={e => setInput(e.target.value)}
                    disabled={status !== 'ready'}
                />
            </form>
        </div>
    );
}


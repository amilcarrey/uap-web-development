'use client'
import { useAtomValue } from "jotai"
import file from '../../public/file.png'
import sendIcon from '../../public/paper-plane.png'
import { libroInfoBasica, Message, MessageItemProps } from "./types"
import { chatAtom } from "./store"
import Image from 'next/image'
import { useChat } from '@ai-sdk/react'
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LibrosListComponent from "@/components/ui/LibroListComponent"
import { LoaderIcon } from "lucide-react"

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
    const { messages, status, sendMessage, } = useChat()
    const [input, setInput] = useState('');
    const handleSubmit = (e: any) => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
    };

    console.log(messages)
    console.log(status)

    return (
        <div className="w-3/4">
            {messages.map(message => (
                <div key={message.id} className="flex justify-center">
                    {
                        message.role === 'user' ?
                            <div key={message.id} className="p-2 flex justify-end w-full">
                                <div className="rounded-md bg-[#466946] p-1.5 text-white">
                                    {message.parts.map((part, index) => {
                                        switch (part.type) {
                                            case 'text':
                                                return <span key={index}>{part.text}</span>;
                                        }
                                    })}
                                </div>
                            </div>
                            :
                            <div  key={message.id} className="p-2 flex justify-baseline w-full">
                                <div className="rounded-md bg-[#3f483f] p-2 text-white max-w-2/3">
                                    {message.parts.map((part, index) => {
                                        switch (part.type) {
                                            case 'text':
                                                return <>
                                                    <div key={index} className="prose prose-invert max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {`${part.text}`}
                                                        </ReactMarkdown>
                                                    </div>
                                                </>

                                            case 'reasoning':
                                                if (message.parts.length == 2) return <span key={index}> <Spinner></Spinner>  </span>
                                                break

                                            case 'step-start':
                                                if (message.parts.length == 1) return <span key={index}> <Spinner></Spinner>  </span>
                                                break

                                            case 'tool-searchBooks':
                                                if (!part.output && part.errorText) {
                                                    return (
                                                        <span key={part.toolCallId} className="text-red-500">
                                                            Error al buscar: {part.errorText}
                                                        </span>
                                                    );
                                                }

                                                else if (part.output && typeof part.output === 'object' && 'books' in part.output && Array.isArray(part.output.books)) {
                                                    return <>
                                                        <span key={part.toolCallId} className="prose prose-invert max-w-none">
                                                            <LibrosListComponent libros={part.output.books as libroInfoBasica[]}></LibrosListComponent>
                                                        </span>
                                                    </>
                                                }
                                                else {
                                                    return <>
                                                        <span key={part.toolCallId} className="prose prose-invert max-w-none">
                                                            <LoaderIcon />
                                                        </span>
                                                    </>
                                                }
                                        }
                                    })}
                                </div>
                            </div>
                    }
                </div>
            ))}

            <div className="p-4 flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="flex justify-around items-center bg-black/25 rounded-md p-2 w-1/2">
                    <button type="button" onClick={() => toast.info('Aun no tienes la version premium')} className='hover:bg-black/20 p-1 rounded-sm'>
                        <Image src={file} alt='' height={20} />
                    </button>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        name='prompt' type="text" placeholder="Escribe aca"
                        className='border-b-white rounded-md w-2/3'
                        disabled={status !== 'ready'} />
                    <button type='submit' className='hover:bg-black/20 p-1 rounded-sm'>
                        <Image src={sendIcon} alt='' height={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

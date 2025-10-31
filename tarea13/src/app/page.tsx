'use client'
import file from '../../public/file.png'
import send from '../../public/paper-plane.png'
import Image from "next/image";
import ChatComponent, { ChatHook } from "./ChatComponent";
import { toast } from 'sonner';
import { FormEvent } from 'react';
import { Message } from './types';
import { chatAtom } from './store';
import { useAtom } from 'jotai';
import { enviarPrompt } from './serverActions';

export default function Home() {
  const [chat, setChat] = useAtom(chatAtom)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const prompt = formData.get('prompt')?.toString();

    //considerar el sanamiento de la entrada

    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      messageContent: prompt!,
      transmitter: 'client'
    }

    // optimistic update (do not mutate atom array; use setChat to create a new array)
    setChat((prev) => [...prev, newMessage])
    target.reset()


    const AIresponse = await enviarPrompt(prompt!)
    console.log('respuesta', AIresponse);

    const AImessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      messageContent: AIresponse?.message?.content ?? 'No response',
      transmitter: 'server'
    }

    setChat((prev) => [...prev, AImessage])

  }


  return (
    <div className="bg-gray-400 ">
      <main className='flex flex-col min-h-screen justify-between'>
        <div className='p-3 flex justify-center bg-black/25'>
          <h1 className='text-2xl text-white font-semibold'>JetonChat</h1>
        </div>
        <div className='h-8/10'>
          <div className='h-3/4'>
            <ChatHook></ChatHook>
          </div>
          <div className='p-4 flex justify-center'>
            <form onSubmit={(e) => handleSubmit(e)} className="flex justify-around items-center bg-black/25 rounded-md p-2 w-1/2">
              <button onClick={() => toast.info('Aun no tienes la version premium')} className='hover:bg-black/20 p-1 rounded-sm'>
                <Image src={file} alt='' height={20} />
              </button>
              <input name='prompt' type="text" placeholder="Escribe aca" className='border-b-white rounded-md w-2/3'/>
              <button type='submit' className='hover:bg-black/20 p-1 rounded-sm'>
                <Image src={send} alt='' height={20} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
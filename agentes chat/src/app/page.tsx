'use client'
import file from '../../public/file.png'
import send from '../../public/paper-plane.png'
import Image from "next/image";
import { ChatHook } from "./ChatComponent";
import { toast } from 'sonner';
import { FormEvent } from 'react';
import { Message } from './types';
import { chatAtom } from './store';
import { useAtom } from 'jotai';
import { enviarPrompt } from './serverActions';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {

  return (
    <div className="bg-gray-400 ">
      <main className='flex flex-col min-h-screen justify-between'>
        <div className='p-3 flex justify-center bg-black/25'>
          <h1 className='text-2xl text-white font-semibold'>JetonChat</h1>
        </div>
        <div className='h-8/10'>
          <div className='h-3/4 flex justify-center'>
            <ChatHook></ChatHook>
          </div>
          {/*<div className='p-4 flex justify-center'>
            <form onSubmit={(e) => handleSubmit(e)} className="flex justify-around items-center bg-black/25 rounded-md p-2 w-1/2">
              <button onClick={() => toast.info('Aun no tienes la version premium')} className='hover:bg-black/20 p-1 rounded-sm'>
                <Image src={file} alt='' height={20} />
              </button>
              <input name='prompt' type="text" placeholder="Escribe aca" className='border-b-white rounded-md w-2/3'/>
              <button type='submit' className='hover:bg-black/20 p-1 rounded-sm'>
                <Image src={send} alt='' height={20} />
              </button>
            </form>
          </div>*/}
        </div>
      </main>
    </div>
  );
}
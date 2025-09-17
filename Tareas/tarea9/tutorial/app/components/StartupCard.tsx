import React from 'react'
import { formatDate } from '../../src/lib/utils'
import { EyeIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const StartupCard = ({post}: {post: StartupCardType}) => {
    const {_createdAt, views, author:{_id: authorId, name}, title, category, _id, image} = post;
  return (
    <>
    <li className='startup-card group'>
        <div className='flex-between'>
            <p className='startup_card_date'>
                {formatDate(_createdAt)}
            </p>
            <div className='flex gap-1.5'>
                <EyeIcon className='size-6 text-primary'/>
                <span className='text-16-medium'>{views}</span>

            </div>
        </div>
        <div className='flex-between mt-5 gap-5'>
            <div className='flex-1'>
                <Link href={`/user/${authorId}`}>
                <p className='text-16-medium line-clamp-1'>
                    {name || 'Unknown Author'}
                </p>
                </Link>
                <Link href={`/startup/${_id}`}>
                    <h3 className='text-26-semibold'>
                        {title}
                    </h3>
                </Link>


            </div>
            <Link href={`/user/${authorId}`}>
                <Image src="http:placehold.co/600x400" alt="placeholder" width={48} height={48} className='rounded-full'/>
                
            </Link>

        </div>
    </li>
    </>
  )
}

export default StartupCard
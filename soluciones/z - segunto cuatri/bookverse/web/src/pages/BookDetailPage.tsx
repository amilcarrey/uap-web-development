import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BooksAPI, ReviewsAPI } from '../api/client'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import { useUserId } from '../hooks/useUser'


export default function BookDetailPage(){
const { id = '' } = useParams()
const userId = useUserId()
const qc = useQueryClient()


const book = useQuery({ queryKey:['book', id], queryFn: ()=>BooksAPI.detail(id) })
const reviews = useQuery({ queryKey:['reviews', id], queryFn: ()=>ReviewsAPI.list(id) })


const create = useMutation({
mutationFn: (body:any)=> ReviewsAPI.create(userId, { ...body, bookId: id }),
onSuccess: ()=> qc.invalidateQueries({ queryKey:['reviews', id] })
})


const vote = useMutation({
mutationFn: ({ reviewId, value }:{reviewId:string, value:1|-1}) => ReviewsAPI.vote(userId, reviewId, value),
onSuccess: ()=> qc.invalidateQueries({ queryKey:['reviews', id] })
})


if(book.isLoading) return <p>Cargando…</p>
if(book.isError) return <p>Error cargando el libro</p>
const b:any = book.data


return (
<section style={{ display:'grid', gap:12 }}>
<div style={{ display:'flex', gap:16 }}>
{b.image && <img src={b.image} alt={b.title} width={160} />}
<div>
<h1>{b.title}</h1>
<div>{b.authors?.join(', ')}</div>
<small>{b.publishedDate} · {b.publisher}</small>
<p>{b.description}</p>
</div>
</div>


<ReviewForm bookId={id} onSubmit={(body)=> create.mutateAsync(body)} />
{reviews.isLoading ? <p>Cargando reseñas…</p> : reviews.isError ? <p>Error cargando reseñas</p> : (
<ReviewList items={reviews.data as any[]} onVote={(rid, v)=> vote.mutate({ reviewId: rid, value: v })} />
)}
</section>
)
}
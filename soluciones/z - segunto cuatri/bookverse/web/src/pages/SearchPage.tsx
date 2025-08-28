import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BooksAPI } from '../api/client'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'


export default function SearchPage(){
const [q, setQ] = useState('harry potter')
const { data, isLoading, isError, refetch } = useQuery({
queryKey:['search', q],
queryFn: () => BooksAPI.search(q),
})


return (
<section>
<SearchBar onSearch={(qq)=>{ setQ(qq); refetch() }} />
{isLoading && <p>Cargando…</p>}
{isError && <p>Error buscando libros.</p>}
<div style={{ display:'grid', gap:8, marginTop:12 }}>
{data?.map((b:any)=> <BookCard key={b.id} b={b} />)}
</div>
</section>
)
}
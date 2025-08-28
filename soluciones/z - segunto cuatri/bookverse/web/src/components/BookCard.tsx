import { Link } from 'react-router-dom'
export default function BookCard({ b }: { b: any }){
return (
<div style={{ display:'flex', gap:12, padding:8, border:'1px solid #eee', borderRadius:8 }}>
{b.image ? <img src={b.image} alt={b.title} width={80} /> : <div style={{width:80,height:120,background:'#ddd'}} />}
<div>
<Link to={`/book/${b.id}`} style={{ fontWeight:'bold' }}>{b.title}</Link>
<div>{b.authors?.join(', ')}</div>
<div style={{ fontSize:12, opacity:.7 }}>{b.publishedDate} · {b.publisher}</div>
</div>
</div>
)
}
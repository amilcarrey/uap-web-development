import { Outlet, Link } from 'react-router-dom'
export default function App(){
return (
<div style={{ maxWidth: 980, margin: '0 auto', padding: 16 }}>
<header style={{ display:'flex', gap:12, alignItems:'center', marginBottom:16 }}>
<Link to='/' style={{ textDecoration:'none', fontWeight:'bold' }}>📚 BookVerse</Link>
</header>
<Outlet />
</div>
)
}
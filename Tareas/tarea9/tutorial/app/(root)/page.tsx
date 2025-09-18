import Image from "next/image";
import {SearchForm} from "../components/SearchForm";
import StartupCard from "../components/StartupCard";

export default async function Home({searchParams}: {
  searchParams: Promise<{ query?: string; }>;
}){
  const query = (await searchParams).query;
  const posts = [{_createdAt: new Date(),
    views:55,
    author: {_id: 1, name: 'John Doe'},
    description: 'this is a book about testing',
    image:'https://imgs.search.brave.com/TfIVwVmlPCR1z8yGBkVHZ5pBAMuRdkwvZ5ZiUC5TV-c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE2LzA2LzcxLzY4/LzM2MF9GXzE2MDY3/MTY4NDdfYzBsVzB0/UDNJYVBCdEVQbWc1/aUJyekdFcG5WdVd1/RmEuanBn',
    category: 'Fiction',
    title: 'Test Book'
  }]

  return (
    <>
    <section className="pink_container pattern">
      <h1 className="heading"> Busca Libros <br /> Escribe reseñas</h1>
      <p className="sub-heading !max-w-3xl">
        Encuentra y comparte reseñas de tus libros favoritos con nuestra comunidad.
      </p>
      <SearchForm query={query} />
    </section>
    <section className="selection_container">
      <p className="text-30-semibold">
        {query ? `Search for ${query}` : 'Popular Books'}

      </p>
      <ul className="card_grid">
        {posts.length > 0 ? (
          posts?.map((post: StartupCardType,index:number) => (
            <StartupCard key={post?._id} post={post} />
          )
        ) : (
          <p className="no-results">no se encontraron libros</p>
        )}
      </ul>

    </section>
    </>
  );
}

export default function BookDetails({ book }: { book: any }) {
  const { volumeInfo } = book;

  const createMarkup = (html: string) => {
    return { __html: html || '' };
  };

  return (
<div className="flex mb-4">
      <img
        src={volumeInfo.imageLinks?.large || volumeInfo.imageLinks?.thumbnail || '/placeholder.jpg'}
        alt={volumeInfo.title}
        className="w-48 h-72 mr-4"
      />
      <div>
        <h1 className="text-3xl font-bold">{volumeInfo.title}</h1>
        <p>Autor: {volumeInfo.authors?.join(', ') || 'Desconocido'}</p>
        <p>Publicado: {volumeInfo.publishedDate}</p>
        <p>Páginas: {volumeInfo.pageCount}</p>
        {volumeInfo.description ? (
          <div
            className="mt-4"
            dangerouslySetInnerHTML={createMarkup(volumeInfo.description)}
          />
        ) : (
          <p className="mt-4">No hay descripción disponible.</p>
        )}
      </div>
    </div>
  );
}
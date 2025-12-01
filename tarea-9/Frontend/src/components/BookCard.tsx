type Props = {
  id: string;
  title?: string;
  authors?: string[];
  thumbnail?: string;
  onClick: (id: string) => void;
};

const BookCard = ({ id, title, authors, thumbnail, onClick }: Props) => (
  <div
    style={{ border: "1px solid #ccc", padding: 8, cursor: "pointer" }}
    onClick={() => onClick(id)}
  >
    {thumbnail && <img src={thumbnail} alt={title} style={{ width: 100 }} />}
    <h3>{title}</h3>
    {authors && <p>{authors.join(", ")}</p>}
  </div>
);

export default BookCard;

import BookPage from "@/components/BookPage";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <BookPage id={params.id} />;
}

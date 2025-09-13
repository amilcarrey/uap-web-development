import { Card } from "@/components/ui/card";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
    <div className="bg-[#406db0] h-screen">
        <Toaster/>
        <div className="w-full flex justify-center text-5xl p-5 font-extrabold text-white">
              <p>Libreate Varon</p>
        </div>
        <section className="h-20"></section>
        <div className="flex justify-center p-4 gap-2">
            <Card className="p-5 ">
              <a href="/libros">Explorar libros</a>
            </Card>
            <Card className="p-5">
              <a href="/resenas">Explorar reseñas</a>
            </Card>
        </div>
    </div>
    </>
  );
}

import { Card } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
        <Toaster/>
        <div className="w-full flex justify-center text-5xl p-5 font-extrabold">
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
    </>
  );
}

import { describe } from "node:test";
import { expect, it, vi } from "vitest";
import ResenaItem from "./resenaItem";
import { fireEvent, render, screen } from "@testing-library/react";
import { ScanEye } from "lucide-react";
import { getLibroById, likeAction } from "../libros/serverActions";

vi.mock('../libros/serverActions', () =>
({
    likeAction : vi.fn(),
    getLibroById : vi.fn()
}))

describe('Reseña Item', () =>
{
    it('renders correctly', async () =>
    {
        render(await ResenaItem({resena: {
            id: "1",
            libroId: "2",
            title: "Buenazo",
            opinion: "Excelente libro",
            calificacion: 3,
            likes: 32,
            dislikes: 2
        }}))

        const resenaTitle = screen.getByTestId("title")
        const resenaEstrellas = screen.getByTestId("estrellas")
        const resenaOpinion = screen.getByTestId("opinion");
        const resenaLikes = screen.getByTestId("likes");
        const resenaDislikes = screen.getByTestId("dislikes");
        const resenaLibroTitle = screen.getByTestId("libroTitle");

        expect(resenaTitle).toHaveTextContent('Buenazo')
        expect(resenaEstrellas.children.length).toEqual(3)
        expect(resenaOpinion).toHaveTextContent('Excelente libro')
        expect(resenaLikes).toHaveTextContent('32')
        expect(resenaDislikes).toHaveTextContent('2')
        expect(resenaLibroTitle).toHaveTextContent('');
    })

    it('call the accurate function', async () => 
    {
         render(await ResenaItem({resena: {
            id: "1",
            libroId: "2",
            title: "Buenazo",
            opinion: "Excelente libro",
            calificacion: 3,
            likes: 32,
            dislikes: 2
        }}))

        expect(getLibroById).toBeCalled()

        const resenaLikes = screen.getByTestId("formLikes");
        const resenaDislikes = screen.getByTestId("formDislikes");

        expect(resenaLikes).toHaveTextContent('32')
        expect(resenaDislikes).toHaveTextContent('2')

        fireEvent.submit(resenaLikes);
        expect(likeAction).toBeCalled();


        fireEvent.submit(resenaDislikes);
        expect(likeAction).toBeCalled();


    })


})
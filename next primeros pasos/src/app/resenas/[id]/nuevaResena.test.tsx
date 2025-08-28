import { describe, expect, it, vi } from "vitest";
import NuevaResena from "./nuevaResena";
import {fireEvent, render, screen} from "@testing-library/react"
import { error } from "console";
import Page from "./page";
import { headers } from "next/headers";


describe('Nueva Reseña', () =>
{
    it("renders correctly", async () =>
    {
        render(await NuevaResena({libroId: ''}));

        expect(screen.getByPlaceholderText<HTMLInputElement>("Titulo de tu reseña")).toBeInTheDocument();
        expect(screen.getByPlaceholderText<HTMLInputElement>("Aqui tu opinion")).toBeInTheDocument();
        expect(screen.getByPlaceholderText<HTMLInputElement>("Del 1 al 5 cuantas estrellas?")).toBeInTheDocument();
    })

    it("accepts data correctly", async () =>
    {
        render(await NuevaResena({libroId:''}));
    
        const titulo = screen.getByPlaceholderText<HTMLInputElement>("Titulo de tu reseña")
        const opinion = screen.getByPlaceholderText<HTMLInputElement>("Aqui tu opinion");
        const estrellas = screen.getByPlaceholderText<HTMLInputElement>("Del 1 al 5 cuantas estrellas?")
        const botonSubmit = screen.getByTestId('botonSubmit');

        //testing with null values
        fireEvent.click(botonSubmit);
        

        //testing with actual values
        fireEvent.change(titulo, {target:{value: 'Percy Jackson: CRACK'}})
        fireEvent.change(opinion, {target:{value: 'Gran personaje, y saga'}})
        fireEvent.change(estrellas, {target:{value: 5}})
        fireEvent.click(botonSubmit);

        expect(titulo.value).toBe('Percy Jackson: CRACK')
        expect(opinion.value).toBe('Gran personaje, y saga');
        expect(parseInt(estrellas.value)).toBe(5)
        
        //testing with random numbers
        fireEvent.change(estrellas, {target:{value: -2}})
        fireEvent.click(botonSubmit);

        //testing with random numbers
        fireEvent.change(estrellas, {target:{value: 1.2}})
        fireEvent.click(botonSubmit);

        //testing with random numbers
        fireEvent.change(estrellas, {target:{value: 8}})
        fireEvent.click(botonSubmit);
        
    })
})

/*describe('Pagina Nueva Reseña', () =>
    {
        it('renders correctly', async () =>
            {
                render(await Page({params: {id: ''}}))

                const h1 = screen.getByTestId("header1");
                expect(h1).toHaveTextContent('Nueva Reseña')
            }
        )
    }
)*/


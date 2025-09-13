import { screen } from "@testing-library/dom";
import { describe } from "node:test";
import page from "./page";
import { render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { getLibroById } from "../serverActions";
import { libro } from "@/types";

vi.mock('../serverActions', () =>
({
    getLibroById: vi.fn()
}))

describe('Libros [id]', () => {
    it('render correctly', async () => {
        render(await page({ params: { id: '4RENAQAAMAAJ' } }))

        expect(getLibroById).toBeCalled()

        const libro: libro = {
            id: "4RENAQAAMAAJ",
            volumeInfo: {
                authors: [
                    'J. K. Rowling'
                ],
                categories: [
                    "Juvenile Fiction / Family / Orphans & Foster Homes",
                    "Juvenile Fiction / Humorous Stories",
                    "Juvenile Fiction / School & Education",
                    "Juvenile Fiction / Fantasy & Magic",
                    "Juvenile Fiction / Science Fiction / General"
                ],
                title: "Harry Potter y la piedra filosofal",
                pageCount: 254,
                imageLinks: {
                    smallThumbnail: "http://books.google.com/books/content?id=4RENAQAAMAAJ&printsec=frontcover&img=1&zoom=5&imgtk=AFLRE72_Gi5St75K8xVXKrYNZZFV7x5iGsSi5Fcq8hDBPkbHH_ynTBnvPlF8v2zVWCrFerqfwKBNPFa8G2uEvPTfEyIwG5VWfXgv3g0-RGZnFmkRXAUusjMbC9Jm-rlke-R4vSRTB3r3&source=gbs_api",
                    thumbnail: "http://books.google.com/books/content?id=4RENAQAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71ESDORdvkUDXx42wM1D_7lf08F1RFFPAG4YhN2iczV4X-7YuVlvJEvp54yqFwaKZ4ULLqb35l5jVva3Cmd0Ocwoc9t2jyqLvo2MGwsgz9GsXybANGCR6Ty6WwPFtwWaTXCtoxX&source=gbs_api",
                    small: "http://books.google.com/books/content?id=4RENAQAAMAAJ&printsec=frontcover&img=1&zoom=2&imgtk=AFLRE714mxujnuH0ZYbwGdGJ6E6cn_GzEFUw_w5NGdhL_QH1ou20-3pF9d53W2Nx5BUyIeuvOwATF_O01NDziGOLu5UMizoe2r7AMybQSAknlUZh0Cn1nd_NlWnUwJorkbYnwRr5kpPn&source=gbs_api",
                    medium: "http://books.google.com/books/content?id=4RENAQAAMAAJ&printsec=frontcover&img=1&zoom=3&imgtk=AFLRE70k_ciN4saOCJC82rm-6gauaOvWJA8pp0TMPpFlVRhaa6tERob2sJJevun_mo2BpIXcTj9H1nTrKhXzNgW-MTwBu1TknLfCUoHHAHsXrsotjVa0X71UWpOkumyaHz2XLFEkkDON&source=gbs_api",
                    large: "http://books.google.com/books/content?id=4RENAQAAMAAJ&printsec=frontcover&img=1&zoom=4&imgtk=AFLRE73wud-OqDlOptVe9fLIWqH4lMqETbFwc_bZl7Qj-nhvbcYJClZrfrnBOCJv-opyLCSd011k-6_WO-3xz64nU9u-zGLX42s4RJeA5ihgFZhSuvNFPsNNdy4oFjHoBpjo7KcefY7G&source=gbs_api",
                    extraLarge: "http://books.google.com/books/content?id=4RENAQAAMAAJ&printsec=frontcover&img=1&zoom=6&imgtk=AFLRE70OF45UEtGkkV_qNZ2_WzNQobL4fIHngWXQ-rEt-8KEbiwcXCuuKg6hiteXqHD_it7ssDjYHcVBJq7hhL_7N4aUU_Cp1gr4_Gs8FizMFhUIjb9X5bXpYThB_t4u5tCR7a8ws8Hp&source=gbs_api"
                },
                description: "For use in schools and libraries only. Rescued from the outrageous neglect of his aunt and uncle, a young boy with a great destiny proves his worth while attending Hogwarts School for Witchcraft and Wizardry.",
                publishedDate: "2001",
                publisher: "Salamandra"
            }
        }

        const encabezado = screen.getByText('Libreate varon');
        const libroDescripcion = screen.getByTestId('descripcion');
        const libroAuthor = screen.getByTestId('autores');
        const libroTitle = screen.getByTestId('title');
        const published = screen.getByTestId('published');
        const categories = screen.getByTestId('categories'); 

        expect(encabezado).toBeInTheDocument();
        expect(libroDescripcion).toHaveTextContent(libro.volumeInfo.description);
        expect(libroAuthor).toHaveTextContent(libro.volumeInfo.authors.reduce((acu, a) => acu + ', '+ a));
        expect(libroTitle).toHaveTextContent(libro.volumeInfo.title)
        expect(published).toHaveTextContent(libro.volumeInfo.publishedDate)
        expect(categories).toHaveTextContent(libro.volumeInfo.authors.reduce((acu, a) => acu + ', '+ a));

        
    })
}
)
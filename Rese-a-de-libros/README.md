App de Reseñas de Libros

URL de la aplicación deployada
https://rese-a-de-libros.vercel.app/

Repositorio
https://github.com/Issa1616/Rese-a-de-libros.git

Documentacionn
    Para el deploy local
        1.Clonar el repositorio
            git clone https://github.com/Issa1616/Rese-a-de-libros.git
        2. Instalar dependencias
            npm install
        3.Ejecutar la app
            npm run dev
        4. abrir en el navegador
            http://localhost:3000
    GitHub Actions funcionamiento
        PR Build: Se ejecuta automáticamente en cada Pull Request, instala dependencias y realiza el build. Falla si el build falla.
        PR Test: Se ejecuta en cada Pull Request, instala dependencias y corre todos los tests unitarios. Falla si algún test falla.
        Docker Build y Push: Se ejecuta al hacer merge a la rama principal, construye la imagen Docker y la publica en GitHub Container Registry (ghcr.io)
    Variables de entorno necesarias
        NEXT_PUBLIC_API_KEY 
    Ejecutar Docker
        1.Construir imagen
            docker build -t mi-app-nextjs .
        2. Ejecutar contenedor:
            docker run -p 3000:3000 mi-app-nextjs
        3. Abrir en el navegador
            http://localhost:3000
Demostracion
    https://github.com/Issa1616/Rese-a-de-libros/actions/runs/17451814091
    https://github.com/Issa1616/Rese-a-de-libros/tree/refs/heads/feature/prtests
    https://github.com/Issa1616/Rese-a-de-libros/actions/runs/17451203817

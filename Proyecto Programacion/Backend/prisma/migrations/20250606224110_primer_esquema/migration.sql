-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tablero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "propietarioId" INTEGER NOT NULL,
    CONSTRAINT "Tablero_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PermisoTablero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tableroId" INTEGER NOT NULL,
    "nivel" TEXT NOT NULL,
    CONSTRAINT "PermisoTablero_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PermisoTablero_tableroId_fkey" FOREIGN KEY ("tableroId") REFERENCES "Tablero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Preferencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "elementosPagina" INTEGER NOT NULL,
    "IntevaloActualizacion" INTEGER NOT NULL,
    "UpperCase" BOOLEAN NOT NULL,
    CONSTRAINT "Preferencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tableroId" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,
    CONSTRAINT "Tarea_tableroId_fkey" FOREIGN KEY ("tableroId") REFERENCES "Tablero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_alias_key" ON "Usuario"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Preferencia_usuarioId_key" ON "Preferencia"("usuarioId");

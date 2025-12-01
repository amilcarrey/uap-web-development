# 🎬 Demostración: GitHub Actions en Acción

Este documento guía paso a paso cómo ver los GitHub Actions funcionando en tu repositorio.

## Índice

1. [Crear tu Primer PR](#crear-tu-primer-pr)
2. [Ver Build Workflow](#ver-build-workflow)
3. [Ver Test Workflow](#ver-test-workflow)
4. [Docker Workflow en Main](#docker-workflow-en-main)
5. [Ejemplos de Éxito](#ejemplos-de-éxito)
6. [Ejemplos de Fallos](#ejemplos-de-fallos)

---

## Crear tu Primer PR

### Paso 1: Hacer un Cambio en el Código

```bash
# Crear rama nueva
git checkout -b feature/demo-pr

# Modificar algo pequeño
echo "# Demo PR" >> README.md

# Commit
git add README.md
git commit -m "docs: add demo note"

# Push
git push origin feature/demo-pr
```

### Paso 2: Crear Pull Request

**En GitHub:**

1. Ir a tu repositorio
2. Verás un banner: "feature/demo-pr had recent pushes"
3. Click "Compare & pull request"
4. Escribir descripción:
   ```
   ## Demo: Testing CI/CD Workflows
   
   Cambio pequeño para demostrar GitHub Actions
   ```
5. Click "Create pull request"

**Resultado:**
```
Open a Pull Request
Your branch has no conflicts with the base branch.

✓ Build
○ Run Tests on Pull Request
```

---

## Ver Build Workflow

### Paso 1: Navegar a Checks

En el PR recién creado:

1. Ir a tab "Checks" (o ver en "Conversation" → "Checks")
2. Deberías ver:
   ```
   ⏳ Build
   ⏳ Run Tests on Pull Request
   ```
   (Los circulos están girando = en progreso)

3. Esperar 2-3 minutos

---

### Paso 2: Resultados

Después de 2 minutos:

```
✓ Build
  Details

✓ Run Tests on Pull Request
  Details
```

Ambos en verde = ✅ Éxito

---

### Paso 3: Ver Detalles del Build

Click en "Details" del Build:

```
Build on Pull Request

Run ubuntu-latest

✓ Set up job
✓ Checkout code
✓ Setup Node.js
✓ Install dependencies
✓ Build project

Total time: 2m 30s
```

Puedes expandir cada step para ver logs detallados.

---

### Paso 4: Expandir Step Fallido (Si ocurre)

Si algo falla:

```
✓ Set up job
✓ Checkout code
✓ Setup Node.js
✓ Install dependencies
✗ Build project
  Error: cannot find module 'react'
```

Click en "Build project" para ver el error completo:

```
> npm run build

...
ERR! Cannot find module 'react'
ERR! Run `npm install` to install missing dependencies
```

**Cómo fixearlo:**
```bash
git checkout feature/demo-pr
npm install
git add package-lock.json
git commit -m "fix: install missing dependencies"
git push origin feature/demo-pr
```

GitHub Actions re-ejecuta automáticamente.

---

## Ver Test Workflow

### Paso 1: Tests en Progreso

Cuando creas el PR:

```
⏳ Run Tests on Pull Request
  • Checking...
```

Esperar ~30 segundos (más rápido que build).

---

### Paso 2: Resultados de Tests

Después:

```
✓ Run Tests on Pull Request
  18 passed, 0 failed
```

---

### Paso 3: Ver Logs de Tests

Click en "Details":

```
Run Tests on Pull Request

✓ Set up job
✓ Checkout code
✓ Setup Node.js
✓ Install dependencies (cache: hit)
✓ Run tests

Output:
✓ src/app/page.test.tsx (2)
✓ src/app/actions.test.ts (5)
✓ src/app/components/reviews.test.tsx (3)
✓ src/lib/memoryDB.test.ts (8)

Tests:  18 passed in 1.2s
```

---

### Paso 4: Si un Test Falla

Modificar un test para que falle:

**src/app/page.test.tsx:**
```typescript
it('should render', () => {
  render(<Home />);
  // Cambiar expectativa a algo que no existe
  expect(screen.getByText('WRONG TEXT')).toBeInTheDocument();
});
```

Push:
```bash
git add src/app/page.test.tsx
git commit -m "test: demo failing test"
git push origin feature/demo-pr
```

Esperar a que GitHub Actions ejecute:

```
✗ Run Tests on Pull Request
  Tests failed
  
Details:
✗ src/app/page.test.tsx > should render
  AssertionError: Unable to find an element with the text: WRONG TEXT
```

**El PR se bloquea:**
```
This PR has failing checks

✗ Run Tests on Pull Request
  Dismiss

Merge button is disabled until you resolve this.
```

---

## Docker Workflow en Main

### Paso 1: Mergear PR

Una vez que los tests pasan:

1. Click "Merge pull request"
2. Click "Confirm merge"
3. El PR se mergea a `main`

---

### Paso 2: Docker Workflow Inicia

En tab "Actions" verás:

```
Build & Push Docker Image

Recent runs
├─ [main] bc1234d by you
│  ✓ Completed (3m 15s)
```

**Está corriendo:** Ver progreso real

---

### Paso 3: Ver Logs Docker

Click en el run:

```
build-and-push › check out code
build-and-push › Set up Docker Buildx
build-and-push › Log in to GitHub Container Registry
build-and-push › Generate image metadata
build-and-push › Build and push
```

Expandir "Build and push":

```
[1/10] FROM node:20-alpine
[2/10] WORKDIR /app
[3/10] COPY package*.json ./
[4/10] RUN npm ci --only=production=false
[5/10] COPY . .
[6/10] RUN npm run build
[7/10] FROM node:20-alpine
[8/10] WORKDIR /app
[9/10] COPY --from=builder /app/.next ./
[10/10] Run result: success

Pushing to ghcr.io/usuario/repo:latest
Pushing to ghcr.io/usuario/repo:main-abc1234
...
Successfully pushed
```

---

### Paso 4: Verificar Imagen en Registry

En GitHub:

1. Ir a tu repositorio
2. Click "Packages" en la barra lateral
3. Deberías ver tu imagen Docker:

```
ghcr.io/usuario/repo

Latest tags:
- latest (pushed 2 minutes ago)
- main-abc1234d (pushed 2 minutes ago)
- main (pushed 2 minutes ago)

Size: 220MB
```

---

### Paso 5: Descargar y Ejecutar Imagen

```bash
# Login a GitHub Container Registry
docker login ghcr.io
Username: tu-usuario-github
Password: tu-personal-access-token

# Pull la imagen
docker pull ghcr.io/tu-usuario/tu-repo:latest

# Ejecutar
docker run -p 3000:3000 ghcr.io/tu-usuario/tu-repo:latest
```

**Output:**
```
> next-steps@0.1.0 start
> next start

▲ Next.js 15.4.6 (standalone)

✓ Ready on 0.0.0.0:3000
```

Acceder a http://localhost:3000 🎉

---

## Ejemplos de Éxito

### Flujo Completo Exitoso

```
1. Developer hace git push origin feature-branch
                    ↓
2. GitHub Actions detecta → Build Workflow inicia
                    ↓
   ✓ Instala Node.js
   ✓ npm ci
   ✓ npm run build
   └─ Tiempo: 2m 30s
                    ↓
3. Test Workflow inicia
                    ↓
   ✓ npm run test:run
   ✓ 18 tests passed
   └─ Tiempo: 30s
                    ↓
4. PR creado automáticamente
   ✓ All checks passed
   ✓ Ready to merge
                    ↓
5. Developer mergea PR
                    ↓
6. GitHub Actions detecta push a main
                    ↓
7. Docker Workflow inicia
                    ↓
   ✓ docker build
   ✓ docker push ghcr.io/...
   ✓ Imagen disponible
   └─ Tiempo: 3m
                    ↓
8. ✅ Imagen lista para deploy
```

**Timeline:**
```
00:00 - git push
02:30 - Build completa
03:00 - Tests completan
03:00 - Checks verdes
06:00 - Merge a main
06:10 - Docker build inicia
09:10 - ✅ Docker completado
```

---

### Resultado Visible en GitHub

**En el repositorio:**

Tab "Actions":
```
Workflows

Recent workflow runs
├─ Build on Pull Request (PR)
│  ✓ Passed in 3m 5s
│
├─ Run Tests on Pull Request (PR)
│  ✓ Passed in 45s
│
└─ Build & Push Docker Image (Push to main)
   ✓ Completed in 3m 15s
```

---

## Ejemplos de Fallos

### Fallo 1: Build Error

**Escenario:**
```bash
# Modificar archivo sin syntaxis valida
echo "console.log(" >> src/app/page.tsx  # Sintaxis inválida
git push origin feature-bad-syntax
```

**GitHub Actions:**
```
✗ Build
  Build failed

Details:
✗ Run: npm run build

Error: /app/src/app/page.tsx:5:10
...SyntaxError: Unexpected end of file
```

**PR Status:**
```
Some checks failed

✗ Build
  FAILED - See details

This PR cannot be merged until you fix the failing checks.
```

**Cómo Fixear:**
```bash
# Fijar el error
git checkout feature-bad-syntax
# ... arreglar el código ...
git add src/app/page.tsx
git commit -m "fix: syntax error"
git push origin feature-bad-syntax
```

GitHub re-ejecuta automáticamente.

---

### Fallo 2: Test Failure

**Escenario:**
```typescript
// src/lib/memoryDB.test.ts
it('should add item', () => {
  const db = new MemoryDB();
  db.add({ text: 'test' });
  expect(db.items).toHaveLength(1);  // Espera 1
  // Pero la implementación retorna 0
});
```

**GitHub Actions:**
```
✗ Run Tests on Pull Request
  Tests failed

Details:
✗ src/lib/memoryDB.test.ts > should add item
  AssertionError: expected [] to have length 1
```

**PR bloqueado:**
```
✗ Run Tests on Pull Request
  FAILED

Cannot merge until you fix failing tests.
```

---

### Fallo 3: Docker Build Fail

**Escenario:**
```dockerfile
# Dockerfile modificado incorrectamente
RUN npm run build INVALID_FLAG
```

**GitHub Actions:**
```
✗ Build & Push Docker Image

Details:
✗ Build and push

Error: docker build failed
Unknown flag: INVALID_FLAG
```

**Resultado:**
- Imagen no se publica
- Tag `latest` no se actualiza
- Deploy anterior sigue funcionando

---

## Verificación Interactiva

### Checklist para Verificar Todo

- [ ] Crear PR y ver Workflows iniciar
- [ ] Ver Build pasar/fallar
- [ ] Ver Tests pasar/fallar
- [ ] Mergear PR exitoso
- [ ] Ver Docker Workflow ejecutar
- [ ] Verificar imagen en ghcr.io
- [ ] Descargar y ejecutar imagen

---

### Crear Cambios para Demostrar

#### Cambio Simple (Buildea y Testea OK)

```bash
git checkout -b demo/simple-change

# Cambiar README
echo "## Demo Successful" >> README.md

git add README.md
git commit -m "docs: add demo"
git push origin demo/simple-change
```

**Resultado:** ✓ Build ✓ Tests ✓ Mergeable

---

#### Cambio Problemático (Falla Tests)

```bash
git checkout -b demo/failing-test

# Cambiar test
echo "it('should fail', () => expect(false).toBe(true));" >> src/app/page.test.tsx

git add src/app/page.test.tsx
git commit -m "test: intentional failure"
git push origin demo/failing-test
```

**Resultado:** ✓ Build ✗ Tests ✗ No Mergeable

Luego fixearlo:
```bash
git reset HEAD~1
git add .
git commit -m "fix: remove failing test"
git push origin demo/failing-test --force-with-lease
```

---

## Monitoreo Continuo

### Ver Status en Tiempo Real

**Tab Actions:**
```bash
# Ver lista de workflows
https://github.com/tu-usuario/tu-repo/actions
```

**Actualizar cada 30 segundos** para ver progreso.

### Email Notifications

GitHub envía emails cuando:
- ✅ Workflow passes
- ❌ Workflow fails

Configurar en:
- Repo → Settings → Notifications
- Tu perfil → Settings → Notifications

### Badges en README

Agregar al README:

```markdown
![Build](https://github.com/usuario/repo/actions/workflows/build.yml/badge.svg)
![Tests](https://github.com/usuario/repo/actions/workflows/test.yml/badge.svg)
![Docker](https://github.com/usuario/repo/actions/workflows/docker.yml/badge.svg)
```

Muestra status en vivo:
- 🟢 Todos los workflows pasando
- 🔴 Alguno fallando
- 🟡 En progreso

---

## Resumen: Lo que Demostraste

✅ **Build Workflow funciona**
- Instala dependencias
- Compila TypeScript
- Detecta errores

✅ **Test Workflow funciona**
- Ejecuta Vitest
- Reporte de tests
- Bloquea PR si fallan

✅ **Docker Workflow funciona**
- Construye imagen multi-stage
- Publica a GitHub Container Registry
- Imagen lista para deploy

✅ **GitHub Actions integrado en tu flujo**
- PR bloqueado si hay errores
- Merge automático si pasa
- Deploy automático al main

**¡Tu proyecto tiene CI/CD profesional! 🚀**

---

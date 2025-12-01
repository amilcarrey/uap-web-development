# 📖 Guía Detallada: GitHub Actions Explicado

Este documento explica en detalle cómo funcionan los GitHub Actions configurados en el proyecto.

## Índice

1. [Conceptos Básicos](#conceptos-básicos)
2. [Workflow: Build on Pull Request](#workflow-build-on-pull-request)
3. [Workflow: Run Tests](#workflow-run-tests)
4. [Workflow: Docker Build & Push](#workflow-docker-build--push)
5. [Debugging y Logs](#debugging-y-logs)
6. [Best Practices](#best-practices)

---

## Conceptos Básicos

### ¿Qué es un Workflow?

Un **workflow** es una secuencia automatizada de tareas que se ejecuta cuando ocurren eventos específicos en tu repositorio.

```
Evento → Trigger → Workflow → Jobs → Steps → Actions
```

### Anatomía de un Workflow

```yaml
name: Nombre del Workflow                    # Identificador visual

on:                                          # Eventos que disparan
  pull_request:                              # En cada PR
  push:                                      # En cada push
    branches: [main]                         # Solo rama main
  workflow_dispatch:                         # Manual

env:                                         # Variables globales
  NODE_VERSION: '20'

jobs:                                        # Trabajos a ejecutar
  my-job:                                    # ID del job
    runs-on: ubuntu-latest                   # Sistema operativo
    
    steps:                                   # Pasos del job
      - uses: actions/checkout@v4            # Acción (tarea predefinida)
      - name: Paso 1                         # Nombre descriptivo
        run: npm install                     # Comando a ejecutar
```

### Conceptos Clave

| Término | Significado | Ejemplo |
|---------|------------|---------|
| **Event** | Lo que dispara el workflow | `pull_request`, `push`, `schedule` |
| **Trigger** | Condiciones del evento | `branches: [main]` |
| **Job** | Unidad de trabajo | `build`, `test`, `deploy` |
| **Step** | Tarea dentro de un job | `checkout`, `npm install` |
| **Action** | Tarea reutilizable | `actions/checkout@v4` |
| **Runs-on** | Máquina donde ejecuta | `ubuntu-latest`, `windows-latest` |

---

## Workflow: Build on Pull Request

**Archivo:** `.github/workflows/build.yml`

### Configuración

```yaml
name: Build on Pull Request

on:
  pull_request:
  workflow_dispatch:
```

**Explicación:**
- `pull_request`: Se ejecuta cuando se crea o actualiza un PR
- `workflow_dispatch`: Permite ejecutar manualmente desde GitHub UI

### Jobs Disponibles

Solo tiene un job: `build`

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### Paso a Paso

#### Step 1: `checkout@v4`
```yaml
- uses: actions/checkout@v4
```

**Qué hace:**
- Descarga tu repositorio dentro de la máquina Ubuntu
- Se ubica en el branch del PR
- Permite que los steps siguientes trabajen con tu código

**Equivalente local:**
```bash
git clone https://github.com/usuario/repo.git
cd repo
git checkout feature-branch
```

---

#### Step 2: `setup-node@v4`
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

**Qué hace:**
- Instala Node.js v20 en la máquina
- Configura npm
- Activa cacheo de `node_modules`

**¿Por qué `cache: 'npm'`?**
- First run: Descarga e instala, luego cachea (⏱ 45s)
- Runs posteriores: Usa cache, mucho más rápido (⏱ 5s)

**Ubicación del cache:**
- GitHub almacena en su infraestructura
- Válido por 7 días
- Limitado a 5GB por repositorio

---

#### Step 3: `npm ci`
```yaml
- run: npm ci
```

**Qué hace:**
- **ci** = "clean install" (instalación limpia)
- Instala las versiones EXACTAS del `package-lock.json`
- Mejor que `npm install` para CI/CD

**Ventaja sobre `npm install`:**
- `install`: Puede actualizar versiones menores
- `ci`: Instala exactamente lo que `package-lock.json` dice

---

#### Step 4: `npm run build`
```yaml
- run: npm run build
```

**Qué hace:**
```bash
npm run build
# Equivale a:
next build
```

**Proceso de Next.js build:**
1. Compila TypeScript → JavaScript
2. Bundlea el código
3. Optimiza para producción
4. Genera `.next/` directory
5. Output: `standalone`, `static/`, `public/`

**Tiempo esperado:** ~2 minutos

**Si falla:**
- Error de TypeScript
- Componente no importado
- Variable indefinida
- Archivo faltante

---

### Resultado del Workflow

#### ✅ Build Exitoso
```
✓ All checks passed
  └─ Build: PASSED
```

- Badge verde en el PR
- Comentario en el commit
- Puedes mergear

#### ❌ Build Fallido
```
✗ Some checks failed
  └─ Build: FAILED
```

- Badge rojo
- Details muestra logs de error
- No puedes mergear

**Cómo ver los errores:**
1. En el PR, ver "Checks"
2. Click "Details" en Build
3. Expandir step que falló
4. Leer logs de npm build

---

## Workflow: Run Tests

**Archivo:** `.github/workflows/test.yml`

### Configuración

```yaml
name: Run Tests on Pull Request

on:
    pull_request:
    workflow_dispatch:

jobs:
    test:
        runs-on: ubuntu-latest
```

### Steps

```yaml
steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: npm run test:run
```

**Diferencia con Build workflow:**
- Últimos 3 steps son idénticos
- Step final: `npm run test:run` en lugar de `npm run build`

### npm run test:run

```bash
npm run test:run
# Equivale a:
vitest run
```

**Qué hace:**
1. Lee todos los archivos `*.test.ts` y `*.test.tsx`
2. Ejecuta cada test
3. Reporta resultados
4. Sale con código 0 (éxito) o 1 (fallos)

**Output esperado:**
```
✓ src/app/page.test.tsx (2 tests)
✓ src/app/actions.test.ts (5 tests)
✓ src/app/components/reviews.test.tsx (3 tests)
✓ src/lib/memoryDB.test.ts (8 tests)

test files  4 passed (4)
     tests  18 passed (18)
```

**Tiempo esperado:** ~15 segundos

---

### Test Results en GitHub

#### ✅ Tests Passed
```
✓ All tests passed
  └─ Run Tests: PASSED
```

- Puedes mergear el PR
- Commits pueden publicarse

#### ❌ Tests Failed
```
✗ Test failures detected
  └─ Run Tests: FAILED
```

- PR bloqueado
- Debes ver logs y fijar tests

**Cómo ver qué test falló:**
1. Click "Details" en el workflow
2. Expandir step `run: npm run test:run`
3. Ver output de Vitest
4. Identificar test que falla

**Ejemplo de fallo:**
```
✗ src/app/page.test.tsx > renders welcome message
  AssertionError: expected 'Hello' to contain 'Welcome'
```

---

## Workflow: Docker Build & Push

**Archivo:** `.github/workflows/docker.yml`

**Importante:** Solo se ejecuta cuando se mergea a `main`

### Configuración

```yaml
name: Build & Push Docker Image

on:
    push:
        branches:
            - main
    workflow_dispatch:

env:
    REGISTRY: ghcr.io
    IMAGE_NAME: ${{ github.repository }}
```

**Explicación:**
- `push: branches: [main]`: Solo cuando hacen push a main
- `REGISTRY`: GitHub Container Registry
- `IMAGE_NAME`: Automáticamente `usuario/repo`

### Variables Útiles

| Variable | Valor | Uso |
|----------|-------|-----|
| `${{ github.repository }}` | `usuario/repo` | Nombre del repo |
| `${{ github.actor }}` | `usuario` | El que hizo push |
| `${{ github.sha }}` | `a1b2c3d4...` | Commit hash |
| `${{ secrets.GITHUB_TOKEN }}` | token | Para autenticar |

---

### Jobs: build-and-push

```yaml
jobs:
    build-and-push:
        runs-on: ubuntu-latest
        permissions:
            contents: read
            packages: write
```

**Permissions:**
- `contents: read`: Puede leer el código
- `packages: write`: Puede escribir en registry

---

### Steps Detallados

#### Step 1: Checkout
```yaml
- uses: actions/checkout@v4
```

Descarga el código de main (igual a otros workflows)

---

#### Step 2: Docker BuildX Setup
```yaml
- uses: docker/setup-buildx-action@v3
```

**Qué hace:**
- Configura Docker Buildx
- Permite multi-arquitectura (amd64 + arm64)
- Activa almacenamiento en caché

**¿Por qué BuildX?**
- Build nativo: Solo Intel/AMD
- BuildX: Puede compilar para ARM64 (M1, Servidores ARM)
- Sin BuildX no podrías hacer multi-arch

---

#### Step 3: Docker Login
```yaml
- uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

**Qué hace:**
- Autentica con GitHub Container Registry
- Usuario: Tu usuario GitHub
- Contraseña: Token automático de GitHub

**Equivalente local:**
```bash
docker login ghcr.io
Username: tu-usuario
Password: tu-token-personal
```

---

#### Step 4: Generate Metadata
```yaml
- id: meta
  uses: docker/metadata-action@v5
  with:
    images: ${{env.REGISTRY}}/${{ env.IMAGE_NAME }}
    tags: |
      type=ref,event=branch
      type=sha,prefix={{branch}}-
      type=raw,value=latest,enable={{is_default_branch}}
```

**Qué hace:**
Genera tags automáticos basados en:

1. **Branch tag:**
   ```
   ghcr.io/usuario/repo:main
   ```

2. **Commit SHA:**
   ```
   ghcr.io/usuario/repo:main-a1b2c3d4
   ```

3. **Latest tag:** (solo si es main)
   ```
   ghcr.io/usuario/repo:latest
   ```

**Resultado completo:**
```
ghcr.io/usuario/repo:main
ghcr.io/usuario/repo:main-a1b2c3d4
ghcr.io/usuario/repo:latest
```

---

#### Step 5: Build and Push
```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

**Parámetros:**

| Parámetro | Explicación |
|-----------|------------|
| `context: .` | Construir desde directorio raíz |
| `platforms: linux/amd64,linux/arm64` | Compilar para ambas arquitecturas |
| `push: true` | Enviar al registry (no solo buildear) |
| `tags: ${{ steps.meta.outputs.tags }}` | Usar tags generados |
| `cache-from: type=gha` | Usar GitHub Actions cache |
| `cache-to: type=gha,mode=max` | Guardar en cache |

**Proceso:**

```
1. Lee dockerfile
2. Etapa 1 (builder):
   - FROM node:20-alpine
   - npm ci
   - npm run build
   - Genera .next/
   
3. Etapa 2 (runner):
   - FROM node:20-alpine
   - Copia .next/ del builder
   - Crea usuario nextjs
   - EXPOSE 3000
   
4. Build para:
   - linux/amd64 (Intel/AMD) ✓
   - linux/arm64 (Apple M1/M2) ✓
   
5. Push a ghcr.io
   - ghcr.io/usuario/repo:main
   - ghcr.io/usuario/repo:main-SHA
   - ghcr.io/usuario/repo:latest
```

**Tiempo esperado:** ~3 minutos

---

### Resultado: Docker Image Disponible

Después de que se completa:

```bash
# Puedes hacer pull de la imagen
docker pull ghcr.io/usuario/repo:latest

# Y ejecutarla
docker run -p 3000:3000 ghcr.io/usuario/repo:latest
```

**Dónde ver la imagen:**
1. En tu repositorio GitHub
2. Tab "Packages" en la barra lateral
3. Ver historial de imágenes construidas
4. Información de tags y SHA

---

## Debugging y Logs

### Ver Logs Completos

1. Ir a tu repositorio
2. Tab "Actions"
3. Click en el workflow que fué
4. Click en el job (ej: "build")
5. Expandir cada step para ver output

### Logs de Steps

#### Build Step Logs

Si `npm run build` falla, verás algo como:

```
ERR! → /app/src/app/page.tsx:5:10
ERR! 5 │ import { Component } from 'missing-component'
ERR! │          ^^^^^^^^^
ERR! Type 'missing-component' does not exist as a module.
```

**Cómo leerlo:**
- Línea 5, columna 10 en `page.tsx`
- Componente no importado correctamente

#### Test Step Logs

Si algún test falla:

```
✗ src/app/page.test.tsx > renders home page
  AssertionError: expected element to have text content
    Expected: "Welcome"
    Received: "Hello"
```

**Cómo leerlo:**
- Test `renders home page` en `page.test.tsx`
- Esperaba "Welcome", encontró "Hello"
- El componente probablemente cambió el texto

---

### Debugging Avanzado

#### Re-ejecutar Workflow Fallido

1. Tab "Actions"
2. Click en el workflow fallido
3. Click "Re-run failed jobs"
4. Los jobs fallidos se ejecutan nuevamente

#### Ejecutar Manualmente

Para workflows con `workflow_dispatch`:

1. Tab "Actions"
2. Click en el workflow
3. Click "Run workflow"
4. Seleccionar rama (default: main)
5. Click "Run workflow"

#### SSH Debug (Avanzado)

Para workflows complejos, puedes debuggear:

```yaml
- uses: mxschmitt/action-tmate@v3
  if: failure()
```

Esto abre una sesión SSH que puedes usar para investigar.

---

## Best Practices

### 1. Cache de Dependencias

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # ✅ Siempre activar
```

**Impacto:** Reduce tiempo de CI/CD de 45s a 5s

---

### 2. Usar `npm ci` en lugar de `npm install`

```yaml
- run: npm ci  # ✅ CI/CD
# NO:
- run: npm install  # ❌ Desarrollo
```

**Razón:** `npm ci` respeta `package-lock.json` exactamente

---

### 3. Nombrar Steps Descriptivamente

```yaml
# ✅ Claro
- name: Instalar dependencias con npm
  run: npm ci

# ❌ Vago
- run: npm ci
```

**Ventaja:** Logs más legibles

---

### 4. Usar Actions Oficiales

```yaml
# ✅ Oficial
- uses: actions/checkout@v4
- uses: actions/setup-node@v4

# ❌ Evitar versiones antiguas
- uses: actions/setup-node@v2
```

---

### 5. Documentar Variables de Entorno

```yaml
env:
  # Versión de Node que queremos
  NODE_VERSION: '20'
  # Puerto que usa la app
  APP_PORT: '3000'
```

---

### 6. Usar Secrets para Información Sensible

```yaml
# ✅ Correcto
- run: docker login -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }} ghcr.io

# ❌ Nunca hacer
- run: docker login -u user -p password123 ghcr.io  # ¡Visible en logs!
```

---

### 7. Paralelizar Jobs

Si tienes jobs independientes, hazlos en paralelo:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # ...
  
  test:
    runs-on: ubuntu-latest
    # ...
  
  # Build y test corren en paralelo, no secuencial
```

---

### 8. Usar Badges en README

```markdown
![Build](https://github.com/usuario/repo/actions/workflows/build.yml/badge.svg)
![Tests](https://github.com/usuario/repo/actions/workflows/test.yml/badge.svg)
```

Muestra el status en vivo en tu README.

---

## Resumen

| Workflow | Disparador | Tiempo | Qué Hace |
|----------|-----------|--------|---------|
| **Build** | PR | ~2m | npm run build |
| **Tests** | PR | ~15s | npm run test:run |
| **Docker** | Push a main | ~3m | docker build + push |

Todos están diseñados para **garantizar calidad antes de producción** ✅

---

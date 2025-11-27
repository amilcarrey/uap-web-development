# 🚀 Guía de Deploy - Books & Reviews

Esta guía te ayudará a desplegar la aplicación Books & Reviews en diferentes plataformas.

## 📋 Prerrequisitos

- Cuenta en GitHub
- Cuenta en Vercel (gratuita)
- Docker instalado (opcional)

## 🌐 Deploy en Vercel (Recomendado)

### Paso 1: Preparar el Repositorio

1. **Crear repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/books-and-reviews.git
   git push -u origin main
   ```

2. **Verificar que el build funciona localmente**
   ```bash
   npm run build
   ```

### Paso 2: Conectar con Vercel

1. **Ir a [vercel.com](https://vercel.com)**
2. **Crear cuenta** o iniciar sesión
3. **Conectar con GitHub**
4. **Importar repositorio**
5. **Configurar proyecto:**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Paso 3: Variables de Entorno (Opcional)

En el dashboard de Vercel:
- Settings → Environment Variables
- Agregar variables si es necesario

### Paso 4: Deploy

Vercel detectará automáticamente los cambios y hará deploy automático.

## 🐳 Deploy con Docker

### Construir Imagen Localmente

```bash
# Construir imagen
docker build -t books-and-reviews .

# Ejecutar contenedor
docker run -p 3000:3000 books-and-reviews

# Verificar que funciona
curl http://localhost:3000
```

### Deploy en Servicios Cloud

#### Railway
1. Conectar repositorio de GitHub
2. Railway detectará automáticamente el Dockerfile
3. Deploy automático

#### Heroku
1. Crear `heroku.yml`:
   ```yaml
   build:
     docker:
       web: Dockerfile
   ```
2. Conectar repositorio
3. Deploy

#### Google Cloud Run
```bash
# Construir y subir imagen
gcloud builds submit --tag gcr.io/PROJECT-ID/books-and-reviews

# Deploy
gcloud run deploy books-and-reviews \
  --image gcr.io/PROJECT-ID/books-and-reviews \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔄 GitHub Actions

### Verificar Workflows

Los workflows se ejecutan automáticamente:

1. **En Pull Requests:**
   - Build verification
   - Tests unitarios
   - Linting

2. **En Push a main:**
   - Deploy automático en Vercel
   - Build y push de Docker image

### Verificar Estado

- Ve a tu repositorio en GitHub
- Pestaña "Actions"
- Verifica que todos los workflows pasen

## 🧪 Testing en Producción

### Verificar Funcionalidades

1. **Búsqueda de libros**
2. **Visualización de detalles**
3. **Sistema de reseñas**
4. **Toast notifications**
5. **Responsive design**

### Herramientas de Testing

```bash
# Tests locales
npm run test:run

# Tests con cobertura
npm run test:coverage

# Build de producción
npm run build
```

## 📊 Monitoreo

### Vercel Analytics
- Dashboard de Vercel
- Métricas de performance
- Errores en tiempo real

### Logs
```bash
# Vercel logs
vercel logs

# Docker logs
docker logs <container-id>
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Build falla en Vercel**
   - Verificar `next.config.ts`
   - Revisar dependencias en `package.json`
   - Verificar variables de entorno

2. **Docker build falla**
   - Verificar Dockerfile
   - Verificar `.dockerignore`
   - Verificar permisos

3. **Tests fallan**
   - Verificar configuración de Vitest
   - Revisar mocks y setup
   - Verificar dependencias de testing

### Comandos de Debug

```bash
# Verificar build local
npm run build

# Verificar tests
npm run test:run

# Verificar Docker
docker build -t test .

# Verificar linting
npm run lint
```

## 📈 Optimización

### Performance
- Next.js Image optimization
- Code splitting automático
- Static generation donde sea posible

### SEO
- Meta tags en layout
- Open Graph tags
- Sitemap (opcional)

### Security
- Headers de seguridad
- CSP (Content Security Policy)
- HTTPS obligatorio

## 🎯 Checklist de Deploy

- [ ] Repositorio en GitHub
- [ ] Build local exitoso
- [ ] Tests pasando
- [ ] Deploy en Vercel
- [ ] Docker image construida
- [ ] GitHub Actions configurados
- [ ] Documentación actualizada
- [ ] URL de producción funcionando
- [ ] Responsive design verificado
- [ ] Funcionalidades principales probadas

---

**¡Tu aplicación está lista para producción! 🎉**

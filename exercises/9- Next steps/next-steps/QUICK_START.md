# 🎯 COMIENZO AQUÍ - Guía de 5 Minutos

Si acabas de llegar al proyecto, esta es tu guía para empezar en 5 minutos.

---

## 📍 ¿Dónde Estoy?

Estás en: `exercises/9- Next steps/next-steps/`

```
next-steps/
├── src/
├── public/
├── .github/workflows/     ← GitHub Actions aquí
├── dockerfile            ← Para Docker
├── package.json
├── README_DEPLOYMENT.md   ← Documentación principal
├── INDEX.md              ← Mapa de documentos
└── ← Otros archivos...
```

---

## ⚡ 5 Minutos: Ejecutar Localmente

```bash
# 1. Instalar (30 segundos)
npm install

# 2. Iniciar (10 segundos)
npm run dev

# 3. Abrir navegador (20 segundos)
# Ve a http://localhost:3000
```

**¡Listo! Tienes el proyecto funcionando** ✅

---

## 📚 Siguiente: Elige tu Rol

### 👨‍💻 Soy Desarrollador
Lee: **README_DEPLOYMENT.md**
- Instalación y setup
- Cómo ejecutar tests
- Scripts disponibles

Tiempo: 20 minutos

---

### 🚀 Quiero ver GitHub Actions
Lee: **GITHUB_ACTIONS_DEMO.md**
- Cómo crear un PR
- Ver workflows en acción
- Ejemplos de éxito y fallos

Tiempo: 30 minutos

---

### 🐳 Quiero aprender Docker
Lee: **DOCKER_GUIDE.md**
- Qué es Docker
- Cómo funciona el Dockerfile
- Cómo buildear la imagen

Tiempo: 1 hora

---

### ⚙️ Necesito configurar variables
Lee: **ENVIRONMENT_SETUP.md**
- Variables públicas vs privadas
- Cómo setear .env.local
- Setup por entorno

Tiempo: 30 minutos

---

## 🔥 Tareas Comunes

### "Quiero empezar a desarrollar"

```bash
# 1. Setup
npm install
cp .env.example .env.local
# Editar .env.local si es necesario

# 2. Desarrollo
npm run dev

# 3. Tests
npm run test

# 4. Hacer cambios
# Editar archivos en src/
# El navegador se actualiza automáticamente
```

→ Más detalles: [README_DEPLOYMENT.md - Desarrollo Local](#)

---

### "Quiero ver GitHub Actions funcionando"

```bash
# 1. Crear rama
git checkout -b mi-cambio

# 2. Hacer cambio
echo "# Test" >> README.md

# 3. Push
git add README.md
git commit -m "test"
git push origin mi-cambio

# 4. Abrir PR en GitHub
# → Click "Compare & pull request"

# 5. Esperar 2-3 minutos
# → Ver ✓ Build y ✓ Tests

# 6. Mergear
# → Click "Merge pull request"

# 7. Ver Docker workflow
# → Tab "Actions" → "Build & Push Docker Image"
# → Esperar 3 minutos
```

→ Más detalles: [GITHUB_ACTIONS_DEMO.md](#)

---

### "Quiero buildear Docker localmente"

```bash
# 1. Build
docker build -t next-steps:latest .

# 2. Run
docker run -p 3000:3000 next-steps:latest

# 3. Abrir navegador
# http://localhost:3000
```

→ Más detalles: [DOCKER_GUIDE.md - Comandos Docker](#)

---

### "Tengo un error"

1. **Lee el error completo**
   - ¿Dice "Cannot find module"?
   - ¿Dice "undefined variable"?
   - ¿Dice "Port already in use"?

2. **Busca en README_DEPLOYMENT.md**
   - Ctrl+F para buscar el error
   - Ve a la sección Troubleshooting

3. **Si no está, consulta INDEX.md**
   - Busca tu error en el índice
   - Abre el documento sugerido

---

## 📖 Documentos Disponibles

```
1. README_DEPLOYMENT.md      ← COMIENZA AQUÍ
   └─ Todo lo esencial

2. GITHUB_ACTIONS_EXPLAINED.md
   └─ Cómo funcionan workflows

3. DOCKER_GUIDE.md
   └─ Todo sobre Docker

4. ENVIRONMENT_SETUP.md
   └─ Configuración variables

5. GITHUB_ACTIONS_DEMO.md
   └─ Demostración práctica

6. INDEX.md
   └─ Mapa de documentación

7. .env.example
   └─ Plantilla de variables
```

---

## ✅ Checklist de Verificación

- [ ] Hice `npm install` sin errores
- [ ] Hice `npm run dev` y funciona
- [ ] Puedo acceder a http://localhost:3000
- [ ] Puedo hacer `npm run test:run` y pasan

Si todo es ✅ → **Estás listo para desarrollar!**

---

## 🆘 Ayuda Rápida

| Problema | Solución |
|----------|----------|
| "Module not found" | Haz `npm install` nuevamente |
| "Port 3000 in use" | Cambia puerto: `npm run dev -- -p 3001` |
| "Tests failing" | Lee los logs: `npm run test` |
| ".env variables undefined" | Copia `.env.example` a `.env.local` |
| "Docker build fails" | Verifica Docker está instalado: `docker --version` |

---

## 🎓 Recomendación

**Para principiantes:**
1. Ejecuta `npm run dev`
2. Lee **README_DEPLOYMENT.md**
3. Experimenta con cambios
4. Crea tu primer PR en GitHub

**Para DevOps:**
1. Lee **DOCKER_GUIDE.md**
2. Lee **GITHUB_ACTIONS_EXPLAINED.md**
3. Sigue los pasos en **GITHUB_ACTIONS_DEMO.md**

---

## 📞 ¿Necesitas Más Ayuda?

- Documentación: Ver **INDEX.md**
- Errores: Ver **README_DEPLOYMENT.md → Troubleshooting**
- Conceptos: Ver documento específico en **INDEX.md**

---

## 🚀 Próximo Paso

**→ Abre `README_DEPLOYMENT.md` y sigue las instrucciones paso a paso**

O si prefieres específicamente:
- **Docker** → DOCKER_GUIDE.md
- **GitHub Actions** → GITHUB_ACTIONS_DEMO.md
- **Variables** → ENVIRONMENT_SETUP.md

---

**¡Bienvenido al proyecto! 👋**

*Documentación actualizada: Diciembre 2024*

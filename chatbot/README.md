# Chatbot con Next.js + AI SDK + OpenRouter (backend-only)

Este repo es un **starter seguro** para un chatbot con:

- Next.js **15+** (App Router)
- Vercel **AI SDK** (streaming en tiempo real)
- **OpenRouter** como proveedor LLM (API compatible con OpenAI)
- Persistencia de conversación **en sesión** (sessionStorage)
- Validación + sanitización tanto **frontend** como **backend**
- Rate limiting básico (demo) en el endpoint

> ⚠️ Seguridad: la API key **nunca** se expone al frontend. Solo se usa en `app/api/chat/route.ts`.

---

## 1) Instalación

```bash
npm i
npm run dev
```

Abrí `http://localhost:3000`.

---

## 2) Configurar variables de entorno

1. Copiá el ejemplo:

```bash
cp .env.local.example .env.local
```

2. Editá `.env.local` y poné tu key real:

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=Next.js OpenRouter Chatbot
```

**Importante:** usá modelos gratuitos (normalmente terminan en `:free`).

Docs de OpenRouter recomiendan `HTTP-Referer` y `X-Title` como headers opcionales:
https://openrouter.ai/docs/quickstart

---

## 3) Cómo funciona (Arquitectura)

### Frontend (Client Components)
- `components/ChatShell.tsx` usa `useChat()` de `@ai-sdk/react`
- Renderiza mensajes y hace streaming de la respuesta
- Muestra estados: listo / enviando / escribiendo / error
- Persiste la conversación en `sessionStorage`

### Backend (Route Handler)
- `app/api/chat/route.ts`:
  - valida el body con Zod
  - sanitiza inputs del user
  - aplica rate limiting básico
  - llama a OpenRouter usando `createOpenAI()` (baseURL OpenRouter)
  - hace streaming vía `result.toUIMessageStreamResponse()`

---

## 4) Deploy (Vercel recomendado)

En Vercel Dashboard:
- Configurá `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, etc. como **Environment Variables**
- **Nunca** subas `.env.local` al repo (ya está en `.gitignore`)

---

## 5) Personalizaciones sugeridas
- Reemplazar rate limiting in-memory por Redis/Upstash
- Persistencia real (DB/Redis) si querés historial multi-sesión
- Agregar “tool calling” (AI SDK tools) si necesitás acciones server-side

---

## Troubleshooting
- Si ves `SERVER_MISCONFIGURED`: falta `OPENROUTER_API_KEY`
- Si hay `RATE_LIMITED`: bajá el ritmo o subí `MAX_REQ_PER_WINDOW` en `lib/security.ts`

# Ambar Nayrubis — Sitio de fotografía

Portafolio público y galerías privadas para clientes, con favoritos y descargas.
Hecho con **Next.js 16 + Payload CMS 3**, **PostgreSQL (Neon)**, **Cloudflare R2** y desplegado en **Vercel**.

## Funcionalidades

| Área | Qué incluye |
|---|---|
| Sitio público | Inicio con carrusel a pantalla completa, portafolio por álbumes (masonry + lightbox con zoom), Sobre mí, Contacto |
| Galerías de clientes (`/g/<código>`) | Contraseña opcional, fecha de expiración, favoritos guardados por email, descarga individual, ZIP de todo o solo de las favoritas |
| Acceso de clientes (`/clientes`) | El cliente escribe código + contraseña |
| Panel `/admin` (en español) | Álbumes, fotos, galerías, selecciones de favoritos de cada cliente, consultas del formulario y ajustes del sitio |
| Email | Aviso de cada consulta nueva vía Resend |

### Cómo están protegidas las fotos

- **Portafolio** → bucket R2 **público**. Las imágenes se sirven directamente desde R2/CDN (Vercel no paga ancho de banda).
- **Clientes** → bucket R2 **privado**. Al desbloquear la galería se firma una cookie (HMAC) y la página genera URLs prefirmadas de R2 válidas unas horas. La API `/api/client-photos` solo responde a administradores.
- Si cambias la contraseña de una galería, se invalidan todos los accesos anteriores.
- Las subidas van **del navegador directo a R2** (`clientUploads`), así que no aplica el límite de 4.5 MB por petición de Vercel.
- Al subir cada foto, Payload genera tamaños WebP (480/1080/2048 px) y conserva el original para descargas.

## Desarrollo local

Requisitos: Node 22+, pnpm y Docker o Podman.

```bash
cp .env.example .env          # rellena PAYLOAD_SECRET
pnpm install
pnpm db:up                    # Postgres local en :5432
pnpm dev                      # http://localhost:3000  ·  panel: /admin
```

En desarrollo, si las variables de R2 están vacías, los archivos se guardan en `./uploads`.
El esquema de la base se sincroniza solo (`push`) mientras uses `pnpm dev`.

### Cambios en el modelo de datos

Si modificas colecciones o campos:

```bash
pnpm migrate:create nombre-del-cambio   # genera src/migrations/*
pnpm generate:types                     # actualiza src/payload-types.ts
```

Haz commit de la migración. En Vercel se aplica sola antes de cada build (`pnpm run ci`).

## Despliegue en producción

### 1. Base de datos — Neon

1. Crea un proyecto en [neon.tech](https://neon.tech) (o desde *Vercel → Storage → Neon*, que crea las variables por ti).
2. Copia la **connection string pooled** (`...-pooler...`) como `DATABASE_URL`.

### 2. Archivos — Cloudflare R2

1. En Cloudflare → R2, crea dos buckets: `ambar-public` y `ambar-private`.
2. En `ambar-public` → *Settings → Public access*: conecta un dominio propio (p. ej. `fotos.tudominio.com`) o activa `r2.dev`. Esa URL va en `R2_PUBLIC_URL`.
   **No** actives el acceso público en `ambar-private`.
3. *R2 → Manage API tokens* → crea un token con **Object Read & Write** sobre ambos buckets. Así obtienes `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` y `R2_ACCOUNT_ID`.
4. Añade esta política CORS en **los dos buckets** (*Settings → CORS policy*), con tu dominio:

```json
[
  {
    "AllowedOrigins": ["https://tudominio.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. Email — Resend (opcional)

Crea una cuenta en [resend.com](https://resend.com), verifica tu dominio y copia la API key en `RESEND_API_KEY`.

### 4. Vercel

1. Sube el repositorio a GitHub e impórtalo en Vercel. `vercel.json` ya configura pnpm y el comando de build (`payload migrate && next build`).
2. En *Settings → Environment Variables*, añade todas las variables de `.env.example`.
3. Plan: **Pro** (uso comercial; además permite descargas ZIP largas, `maxDuration` 300 s).
4. Despliega, entra en `https://tudominio.com/admin` y crea el primer usuario administrador.
5. Conecta el dominio en *Settings → Domains*.

## Uso del panel (para la fotógrafa)

1. **Ajustes del sitio**: nombre, frase, fotos de portada, texto "Sobre mí", email y redes.
2. **Portafolio → Álbumes**: crea un álbum, arrastra todas las fotos de golpe, elige la portada y marca "Destacado en inicio" si quieres que salga en la portada.
3. **Clientes → Galerías**: crea la galería, sube las fotos y pon una contraseña. Comparte con el cliente el enlace `https://tudominio.com/g/<slug>` y la contraseña.
4. **Clientes → Selecciones de favoritos**: aquí verás qué fotos eligió cada cliente.
5. **Clientes → Consultas**: mensajes del formulario de contacto.

## Costos estimados (mensuales)

| Servicio | Plan | Costo |
|---|---|---|
| Vercel | Pro | $20 |
| Neon | Free (0.5 GB) → Launch si crece | $0 – $19 |
| Cloudflare R2 | 10 GB gratis, luego $0.015/GB; **sin coste de salida** | ~$1 – $5 |
| Resend | Free (3,000 emails/mes) | $0 |

## Estructura

```
src/
  app/(frontend)/          sitio público, galerías y rutas de descarga/favoritos
  app/(payload)/           panel /admin y API REST (generado por Payload)
  collections/             Albums, Media, Galleries, ClientPhotos, Selections, Inquiries, Users
  globals/SiteSettings.ts  ajustes editables del sitio
  lib/                     R2, URLs firmadas, acceso a galerías, consultas
  components/              UI (grid, lightbox, formularios…)
  migrations/              migraciones de Postgres
```

## Próximos pasos posibles

- Tienda de impresiones con Stripe o Mercado Pago.
- Marca de agua automática en las galerías.
- Email automático al cliente cuando su galería esté lista.
- Límite de intentos de contraseña (p. ej. con Upstash Ratelimit).

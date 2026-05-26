# Package Tracker

Sistema de rastreo de paquetes para empresas en Guatemala. Panel de administración con gestión de órdenes, clientes, informes y seguimiento público sin autenticación.

## Características

- **Rastreo público** — seguimiento de paquetes sin autenticación
- **Dashboard administrativo** — resumen con estadísticas y órdenes recientes
- **Gestión de órdenes** — CRUD completo con generación de tracking number, items dinámicos, tipos de entrega (delivery/pickup)
- **Gestión de clientes** — CRUD con soft delete, soporte para guest en órdenes
- **Actualización de estados** — pendiente → confirmado → en tránsito → entregado/recogido
- **Tickets PDF** — descarga con código QR, nombre de compañía configurable
- **Informes y exportación** — métricas, filtros por rango de fechas/cliente/estado, exportación CSV
- **Configuración** — nombre de compañía para PDFs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui (base-nova), Lucide icons
- **Base de datos**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM + drizzle-kit
- **Autenticación**: NextAuth v5 (Credentials provider, JWT)
- **PDF**: @react-pdf/renderer con QR codes embebidos
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint 9 (flat config) + Prettier + Commitlint + Husky + lint-staged

## Requisitos

- Node.js 20+
- npm, yarn, pnpm o bun
- PostgreSQL database (Neon recomendado)

## Estructura

```
src/
├── app/                    # App Router (RSC-first)
│   ├── page.tsx           # Landing público
│   ├── login/             # Login admin
│   ├── track/             # Rastreo público
│   ├── admin/             # Panel admin
│   │   ├── page.tsx       # Dashboard
│   │   ├── orders/        # CRUD órdenes
│   │   ├── clients/       # CRUD clientes
│   │   ├── reports/       # Informes + exportación
│   │   └── settings/      # Configuración
│   └── api/               # API routes (auth, tickets)
├── components/            # Componentes React
│   ├── ui/                # shadcn/ui
│   ├── order-form.tsx     # Formulario órdenes
│   ├── client-form.tsx    # Formulario clientes
│   ├── status-update-form.tsx
│   ├── report-filters.tsx
│   └── ticket-template.tsx # Template PDF
├── db/                    # Schema Drizzle + relaciones
├── lib/
│   ├── actions/           # Server Actions (CRUD)
│   ├── services/          # PDF, QR code
│   └── auth.ts            # Config NextAuth
├── test/                  # Tests Vitest
└── middleware.ts           # Auth middleware
```

## Instalación

```bash
npm install
cp .env.example .env.local
```

Editar `.env.local`:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
```

Inicializar base de datos y admin:

```bash
npx drizzle-kit push
npm run seed:admin
```

Iniciar desarrollo:

```bash
npm run dev
```

## Uso

### Panel de Administración

- URL: `http://localhost:3000/login`
- Credenciales por defecto: `admin@tracker.com` / `admin123`

### Rastreo Público

- URL: `http://localhost:3000/track`
- Ingresa el número de seguimiento para ver el estado del paquete

## Scripts

| Comando                 | Descripción            |
| ----------------------- | ---------------------- |
| `npm run dev`           | Servidor de desarrollo |
| `npm run build`         | Build producción       |
| `npm run lint`          | ESLint                 |
| `npm test`              | Tests (watch)          |
| `npm run test:run`      | Tests (una vez)        |
| `npm run test:coverage` | Tests con cobertura    |
| `npm run seed:admin`    | Crear admin inicial    |

## Arquitectura

- **RSC-first**: la mayoría de páginas son Server Components, con islas de interactividad cliente donde se necesita (formularios, filtros)
- **Server Actions**: todas las operaciones CRUD usan `'use server'` con `revalidatePath` para invalidación de caché
- **Auth**: NextAuth middleware protege `/admin/*`, redirige a `/login` si no hay sesión
- **PDF**: generación server-side con `@react-pdf/renderer`, QR codes embebidos como base64

## Deployment

Recomendado: Vercel. Conectar repositorio, agregar variables de entorno, deploy automático.

## Licencia

MIT

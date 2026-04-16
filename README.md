# Package Tracker

Sistema de rastreo de paquetes para Guatemala.

## Características

- Panel de administración seguro
- Gestión de clientes y órdenes
- Rastreo público sin autenticación
- Generación de tickets PDF con códigos QR
- Informes y exportación CSV

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Base de datos**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Autenticación**: NextAuth.js v5 (JWT)
- **PDF**: @react-pdf/renderer

## Requisitos

- Node.js 20+
- npm, yarn, pnpm, o bun
- PostgreSQL database (Neon recomendado)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env.local
```

4. Editar `.env.local` con tu configuración:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
```

5. Iniciar base de datos:

```bash
npx drizzle-kit push
```

6. Crear admin inicial:

```bash
npx tsx scripts/seed-admin.ts
```

7. Iniciar servidor:

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

## Deployment

Recomendado: Vercel

1. Conectar repositorio a Vercel
2. Agregar variables de entorno en Vercel
3. Deploy automático

## Licencia

MIT

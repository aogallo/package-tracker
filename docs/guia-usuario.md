# Package Tracker - Guía de Usuario

## 🌐 Acceso Público

**URL:** https://package-tracker-kappa.vercel.app/

Cualquier persona puede rastrear paquetes desde aquí.

---

## 🔐 Acceso Administrador

**URL:** https://package-tracker-kappa.vercel.app/login

**Credenciales:**

```
Email:    admin@tracker.com
Password: admin123
```

---

## 📋 Cómo Usar

### Rastrear un paquete (cualquier persona)

1. Ve a https://package-tracker-kappa.vercel.app/
2. Ingresa el número de seguimiento
3. Click "Rastrear"
4. Ve el estado actual del paquete

### Crear una orden (solo admin)

1. Ve a `/login` e ingresa las credenciales de admin
2. Ve a **"Órdenes"** → **"Nueva Orden"**
3. Selecciona el cliente o ingresa datos de invitado
4. Agrega los artículos con nombre y cantidad
5. Selecciona el tipo de entrega (delivery o pickup)
6. Guarda → obtén el número de seguimiento
7. Comparte el número con el cliente

### Actualizar estado de una orden (solo admin)

1. Ve a **"Órdenes"**
2. Click en la orden que quieres actualizar
3. Cambia el estado usando el dropdown
4. El estado cambia inmediatamente

### Ver reportes (solo admin)

1. Ve a **"Informes"**
2. Usa los filtros por fecha, cliente o estado
3. Exporta a CSV si necesitas los datos

---

## 📁 Links Rápidos

| Página   | URL                                            |
| -------- | ---------------------------------------------- |
| Inicio   | https://package-tracker-kappa.vercel.app/      |
| Login    | https://package-tracker-kappa.vercel.app/login |
| Admin    | https://package-tracker-kappa.vercel.app/admin |
| Rastrear | https://package-tracker-kappa.vercel.app/track |

---

## Estados de Orden

| Estado     | Significado                            |
| ---------- | -------------------------------------- |
| Pendiente  | Orden recibida, esperando confirmación |
| Confirmado | Orden confirmada, siendo preparada     |
| En Camino  | Paquete en tránsito de entrega         |
| Entregado  | Paquete entregado exitosamente         |
| Recogido   | Cliente retiró el paquete              |
| Cancelado  | Orden cancelada                        |

---

## 🔧 Configuración (solo admin)

En **"Configuración"** puedes cambiar el nombre de la empresa que aparece en los tickets PDF.

---

¿Preguntas? Contacta al administrador del sistema.

# Ventas-Frontend — Contexto del Proyecto

> Este archivo registra el estado actual del proyecto y las decisiones tomadas. Se actualiza conforme avanzamos. Es el punto de referencia de contexto para continuar el trabajo desde cualquier máquina.

## Stack

- **Angular 21** (standalone, sin NgModules) · **TypeScript ~5.9** · **RxJS 7** · SSR habilitado (`app.config.server.ts`)
- **Angular Material** (`@angular/cdk`, `@angular/material` 21)
- **jsPDF + jspdf-autotable** (generación de tickets PDF)
- **Vitest** (testing) · **jsdom** · Prettier
- Build: Angular CLI 21 (`ng serve` puerto 4200, sin proxy)
- Nombre del paquete: `demo-ira-car`

## Arquitectura

```
src/app/
├── app.ts / app.html / app.css           → Root (solo router-outlet)
├── app.config.ts                         → providers globales (router, http + interceptor)
├── app.routes.ts                         → rutas (lazy load por componente)
├── core/
│   ├── interfaces/                       → login/, product/, sale/, payment/, cobro/, cash-interface/, user/
│   ├── models/                           → role-model.ts
│   ├── enums/                            → paymentMethod.ts (CASH | DEBIT | CREDIT)
│   ├── service/                          → auth, product, sale, cash, payment, user, role, category, cobro, ticket, permission
│   └── routes/
│       ├── guards/permission-guard.ts    → CanActivateFn por permiso (redirige a /cobro)
│       ├── directives/has-permission-*.ts
│       └── auth-interceptor/auth-interceptor.ts
└── features/
    ├── login/ + forgot-password/ + reset-password/
    ├── charge/  → cobro (POS) + facade/ (sale-facade, cash-facade)   ← NÚCLEO
    ├── sidebar/ (menú lateral reutilizable)
    ├── products/ ← CRUD productos con imagen
    ├── categories/, users/, roles/  ← CRUD completos
    ├── profile/perfil  ← datos + cambio contraseña + logout
    └── placeholders: cash/, sales/, clients/, invoices/, reports/, shopping/, salehistory/
```

**Componentes funcionales**: Login, ForgotPassword, ResetPassword, Cobro (POS), Perfil, Productos, Categorias, Usuarios, Roles, Sidebar.
**Placeholders**: Caja, Ventas, Clientes, Compras, Reportes, Facturas, Salehistory (no ruteado).

## Backend conectado

- Backend: `Ventas-Backend` (carpeta hermana), Spring Boot en **`http://localhost:8081/api`**
- `environment.ts` (dev): `api: 'http://localhost:8081/api'` · `environment-prod.ts`: `http://backend:8080/api`
- Peticiones directas (sin proxy). CORS del backend solo permite `http://localhost:4200`.
- JWT: interceptor funcional `AuthInterceptor` agrega `Authorization: Bearer <token>` a cada request. Token y usuario en `localStorage`.

## Módulos clave

### POS (`/cobro`) — features/charge
- `cobro.ts` delega a `facade/sale-facade.ts` (511 líneas): carrito, búsqueda, barcode, métodos de pago, modal tarjeta, **polling de estado de pago cada 5s**, generación de ticket PDF, venta en efectivo.
- `facade/cash-facade.ts`: abrir/cerrar caja, resumen/corte, diferencia preliminar.
- `CobroService`: carrito en memoria (`BehaviorSubject<CobroItem[]>`), valida stock.
- `TicketService`: genera PDF con jsPDF.

### Servicios (HTTP) — core/service
| Servicio | Base | Uso |
|---|---|---|
| `AuthService` | `/auth` | login, forgot/reset/change-password, me/authorities · token/user en localStorage |
| `ProductService` | `/products` | GET (con `?category=`), POST/PUT **multipart**, DELETE, barcode, search |
| `SaleService` | `/sales` + `/products` | processSale, catálogo POS, barcode, search, historial |
| `PaymentService` | `/payments` | status/{tx} (polling), retry, reverse |
| `CashService` | `/cash` | active, open, close, summary |
| `UserService` | `/users` + `/roles` | CRUD usuarios, activar/desactivar, combo roles |
| `RoleService` | `/roles` | CRUD |
| `PermissionService` | `/permissions` | lista de permisos (agrupados por módulo en Roles) |
| `CategoryService` | `/categories` | CRUD simple |
| `CobroService` | — | carrito local (sin HTTP) |
| `TicketService` | — | PDF (sin HTTP) |

### Autenticación / permisos
- `PermissionGuard` (CanActivateFn) valida `route.data.permission` contra `user.permissions` de localStorage; sin permiso redirige a `/cobro`.
- Directiva `*hasPermission` para ocultar/mostrar UI según permisos.
- Rutas con `data.permission` en `app.routes.ts`: clientes, compras, facturas, productos, reportes, usuarios, ventas, caja, categorias, roles.
- **No hay guard de sesión activa**: el acceso se basa en presencia de token en localStorage.

## Registro de cambios / decisiones

### 2026-09-09 — Sincronización con backend
- **Imágenes de productos**: el backend ahora devuelve la **URL completa** en `img` (`http://localhost:8081/api/uploads/<archivo>`). El frontend usa `[src]="p.img"` directo en `productos.html` → funciona sin cambios.
- Backend corrigió: `@EnableScheduling`, `CategoryRepository.findByName`, almacenamiento real de imágenes.

## Pendientes / issues conocidos

- ⚠️ **`app.routes.ts:4`**: `import { permission } from 'process';` es un import residual de Node sin uso → verificar/eliminar (puede romper build/SSR).
- **Placeholders sin implementar**: Caja, Ventas, Clientes, Compras, Reportes, Facturas.
- **`Salehistory`** no ruteado ni conectado al servicio (declara `SaleHistory[]` pero no inyecta `SaleService`).
- **Sin guard de sesión**: un token expirado no redirige a login automáticamente (el backend responde 401 y no se maneja globalmente).
- `retryPayment` y `reversePayment` definidos en servicio pero sin uso en componentes.
- Estrategia de imágenes aún sin validación de tipo/contenido en backend.

## Cómo ejecutar

```sh
npm install            # dependencias
npm start              # ng serve → http://localhost:4200
npm run build          # build producción (SSR prerender)
npm test               # ng test (vitest)
```
# Campus App — Gestión de Cursos y Usuarios

SPA desarrollada en **Angular 17** (standalone components) para digitalizar la
gestión de cursos y usuarios de una institución educativa. Incluye
autenticación con **JWT**, enrutamiento protegido por **guards** de
autenticación y de roles, y consumo de una **API REST** mediante
`HttpClient` con interceptor automático de token.

## Tabla de contenidos

1. [Requisitos previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Ejecución en desarrollo](#ejecución-en-desarrollo)
4. [Levantar la API simulada](#levantar-la-api-simulada)
5. [Usuarios de prueba](#usuarios-de-prueba)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Rutas y guards](#rutas-y-guards)
8. [Build de producción](#build-de-producción)
9. [Pruebas](#pruebas)

## Requisitos previos

- Node.js 18.13+ o 20.9+
- npm 9+
- Angular CLI 17 (`npm install -g @angular/cli`)

## Instalación

```bash
git clone https://github.com/<tu-usuario>/campus-app.git
cd campus-app
npm install
```

## Ejecución en desarrollo

La app necesita **tres procesos corriendo a la vez**, cada uno en su propia
terminal, todos dentro de la carpeta del proyecto:

**Terminal 1 — API de datos (cursos y usuarios):**
```bash
npm run mock:api
```
Levanta `json-server` en `http://localhost:3000`, sirviendo `/usuarios` y
`/cursos` a partir de `db.json`.

**Terminal 2 — Servidor de autenticación (JWT real):**
```bash
npm run mock:auth
```
Levanta un pequeño servidor Express en `http://localhost:3001` que expone
`POST /auth/login`, valida las credenciales contra la lista de usuarios de
prueba y responde con un JWT firmado (ver `mock-server/auth-server.js`).

**Terminal 3 — Aplicación Angular:**
```bash
npm start
```
Ejecuta `ng serve --proxy-config proxy.conf.json` y expone la app en
`http://localhost:4200`. El proxy redirige automáticamente `/auth/*` al
puerto 3001 y el resto (`/usuarios`, `/cursos`) al puerto 3000, así que
`environment.apiUrl` puede quedar vacío (rutas relativas) y no hay
problemas de CORS.

Abre `http://localhost:4200` en el navegador — deberías ver la pantalla de
login.

## Levantar la API simulada

Los tres procesos anteriores en conjunto simulan un backend completo sin
depender de paquetes de terceros abandonados (como `json-server-auth`,
que no es compatible con versiones recientes de Node.js). Este enfoque usa
únicamente `json-server` (mantenido) y un servidor Express propio de ~50
líneas, ambos incluidos en este repositorio.

Para conectar un backend real (Node/Express, Spring Boot, etc.) en lugar
de la simulación, basta con implementar los mismos tres endpoints y
apuntar `environment.apiUrl` a su URL:

- `POST /auth/login` → `{ token, usuario }`
- `GET/POST/PUT/DELETE /usuarios`
- `GET/POST/PUT/DELETE /cursos`

## Usuarios de prueba

| Rol         | Correo                     | Contraseña |
|-------------|-----------------------------|------------|
| Admin       | admin@institucion.edu       | admin123   |
| Profesor    | profesor@institucion.edu    | profe123   |
| Estudiante  | estudiante@institucion.edu  | est123     |

(Contraseñas de ejemplo; deben configurarse según el backend usado.)

## Estructura del proyecto

```
src/app/
├── core/
│   ├── guards/          # authGuard, roleGuard
│   ├── interceptors/    # authInterceptor (adjunta JWT a cada request)
│   ├── models/          # Usuario, Curso, JwtPayload
│   └── services/        # AuthService, UsuarioService, CursoService
├── auth/
│   └── login/           # Formulario de login
├── features/
│   ├── dashboard/       # Layout protegido + panel principal
│   ├── usuarios/        # Listado y formulario (CRUD) — solo admin
│   └── cursos/          # Listado y formulario (CRUD) — admin y profesor
├── app.routes.ts        # Definición de rutas con lazy loading
└── app.config.ts        # Providers globales (router + HttpClient)
```

## Rutas y guards

| Ruta                     | Acceso                  | Guard                    |
|---------------------------|--------------------------|---------------------------|
| `/login`                  | Público                  | —                          |
| `/dashboard`               | Autenticado              | `authGuard`                |
| `/cursos`                  | admin, profesor, estudiante | `authGuard` + `roleGuard` |
| `/cursos/nuevo`            | admin                    | `authGuard` + `roleGuard` |
| `/usuarios`                | admin                    | `authGuard` + `roleGuard` |
| `/acceso-denegado`         | Autenticado              | `authGuard`                |

Todas las rutas hijas del dashboard usan **lazy loading** (`loadComponent`)
para reducir el tamaño del bundle inicial.

## Build de producción

```bash
npm run build
```

Los artefactos se generan en `dist/campus-app`, listos para desplegar en
cualquier servidor de archivos estáticos (Nginx, Firebase Hosting, S3 +
CloudFront, etc.). Recuerda configurar `environment.prod.ts` con la URL
real de la API.

## Pruebas

```bash
npm test
```

Ejecuta las pruebas unitarias con Karma/Jasmine. Ver el documento técnico
adjunto (`Informe-Tecnico.pdf`) para el detalle de las pruebas funcionales
realizadas sobre login, guards y operaciones CRUD.

## Autores

Proyecto desarrollado por el equipo tecnológico asignado (3 integrantes)
para la digitalización del sistema de gestión de cursos y usuarios de la
institución.

## Licencia

Uso interno / académico.

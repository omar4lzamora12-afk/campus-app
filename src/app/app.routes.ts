import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Iniciar sesión - Campus App',
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent
          ),
        title: 'Panel principal',
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/usuarios/usuario-list/usuario-list.component'
              ).then((m) => m.UsuarioListComponent),
            title: 'Usuarios',
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import(
                './features/usuarios/usuario-form/usuario-form.component'
              ).then((m) => m.UsuarioFormComponent),
            title: 'Nuevo usuario',
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import(
                './features/usuarios/usuario-form/usuario-form.component'
              ).then((m) => m.UsuarioFormComponent),
            title: 'Editar usuario',
          },
        ],
      },
      {
        path: 'cursos',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'profesor', 'estudiante'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/cursos/curso-list/curso-list.component'
              ).then((m) => m.CursoListComponent),
            title: 'Cursos',
          },
          {
            path: 'nuevo',
            canActivate: [roleGuard],
            data: { roles: ['admin'] },
            loadComponent: () =>
              import(
                './features/cursos/curso-form/curso-form.component'
              ).then((m) => m.CursoFormComponent),
            title: 'Nuevo curso',
          },
          {
            path: 'editar/:id',
            canActivate: [roleGuard],
            data: { roles: ['admin'] },
            loadComponent: () =>
              import(
                './features/cursos/curso-form/curso-form.component'
              ).then((m) => m.CursoFormComponent),
            title: 'Editar curso',
          },
        ],
      },
      {
        path: 'acceso-denegado',
        loadComponent: () =>
          import('./features/dashboard/acceso-denegado.component').then(
            (m) => m.AccesoDenegadoComponent
          ),
        title: 'Acceso denegado',
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

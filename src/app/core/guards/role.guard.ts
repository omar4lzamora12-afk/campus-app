import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/usuario.model';

/**
 * Guard de autorización por rol. Lee la lista de roles permitidos desde
 * `route.data['roles']` (definida en las rutas) y compara contra el rol
 * del usuario autenticado. Si no coincide, redirige a una pantalla de
 * acceso denegado en lugar de al login (el usuario SÍ está autenticado,
 * simplemente no tiene permiso para esa sección).
 *
 * Uso en las rutas:
 *   { path: 'usuarios', canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } }
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesPermitidos = (route.data?.['roles'] as Rol[]) ?? [];

  if (rolesPermitidos.length === 0 || authService.tieneRol(rolesPermitidos)) {
    return true;
  }

  return router.createUrlTree(['/acceso-denegado']);
};

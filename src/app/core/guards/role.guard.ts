import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/usuario.model';

/**
 * Autorización por rol. Lee la lista de roles permitidos desde
 * `route.data['roles']`}
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

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticación: bloquea el acceso a rutas privadas si no existe
 * un token JWT válido (presente y no expirado). Si el usuario no está
 * autenticado, se le redirige al login conservando la URL original en
 * queryParams para poder regresar tras iniciar sesión.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.tokenEsValido()) {
    return true;
  }

  authService.logout();
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

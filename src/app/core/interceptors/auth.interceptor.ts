import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional (API moderna de Angular 15+/17) que:
 *  1. Adjunta el header "Authorization: Bearer <token>" a toda petición
 *     saliente hacia la API, siempre que exista un token almacenado.
 *  2. Si el backend responde 401 (token inválido/expirado), limpia la
 *     sesión local y redirige al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.obtenerToken();
  const peticionConToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticionConToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

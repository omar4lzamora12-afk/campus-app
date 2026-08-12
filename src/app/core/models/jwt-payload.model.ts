import { Rol } from './usuario.model';

/**
 * Forma esperada del payload dentro del JWT emitido por el backend.
 */
export interface JwtPayload {
  sub: number; // id del usuario
  email: string;
  nombre: string;
  rol: Rol;
  iat: number;
  exp: number;
}

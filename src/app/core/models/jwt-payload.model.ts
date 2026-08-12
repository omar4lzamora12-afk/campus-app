import { Rol } from './usuario.model';

/**
 * Forma esperada del payload dentro del JWT emitido por el backend.
 * "exp" e "iat" son claims estándar (expiración y fecha de emisión, en segundos epoch).
 */
export interface JwtPayload {
  sub: number; // id del usuario
  email: string;
  nombre: string;
  rol: Rol;
  iat: number;
  exp: number;
}

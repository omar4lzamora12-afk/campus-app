export type Rol = 'admin' | 'profesor' | 'estudiante';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  password?: string; // solo se usa al crear/editar, nunca se muestra en listados
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

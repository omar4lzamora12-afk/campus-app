import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Rol, Usuario } from '../models/usuario.model';
import { JwtPayload } from '../models/jwt-payload.model';

const TOKEN_KEY = 'campus_app_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Señal reactiva con el usuario actual (null si no hay sesión activa o el token expiró).
  private readonly usuarioActualSignal = signal<Usuario | null>(this.recuperarUsuarioDesdeToken());

  readonly usuarioActual = computed(() => this.usuarioActualSignal());
  readonly estaAutenticado = computed(() => this.usuarioActualSignal() !== null);
  readonly rolActual = computed<Rol | null>(() => this.usuarioActualSignal()?.rol ?? null);

  constructor(private http: HttpClient) {}

  /**
   * Envía credenciales a la API.
   */
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credenciales)
      .pipe(
        tap((respuesta) => {
          localStorage.setItem(TOKEN_KEY, respuesta.token);
          this.usuarioActualSignal.set(respuesta.usuario);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.usuarioActualSignal.set(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Valida localmente si el token existe y no ha expirado
   */
  tokenEsValido(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  tieneRol(rolesPermitidos: Rol[]): boolean {
    const rol = this.rolActual();
    return rol !== null && rolesPermitidos.includes(rol);
  }

  private recuperarUsuarioDesdeToken(): Usuario | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const payload = jwtDecode<JwtPayload>(token);
      if (payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      return {
        id: payload.sub,
        nombre: payload.nombre,
        email: payload.email,
        rol: payload.rol,
        activo: true,
      };
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }
}

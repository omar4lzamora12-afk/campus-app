import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Curso } from '../models/curso.model';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private readonly baseUrl = `${environment.apiUrl}/cursos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/${id}`);
  }

  crear(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.baseUrl, curso);
  }

  actualizar(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseUrl}/${id}`, curso);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

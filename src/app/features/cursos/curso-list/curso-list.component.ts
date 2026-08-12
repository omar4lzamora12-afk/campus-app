import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CursoService } from '../../../core/services/curso.service';
import { AuthService } from '../../../core/services/auth.service';
import { Curso } from '../../../core/models/curso.model';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './curso-list.component.html',
})
export class CursoListComponent implements OnInit {
  private cursoService = inject(CursoService);
  private authService = inject(AuthService);

  cursos: Curso[] = [];
  cargando = true;
  errorMensaje = '';

  get puedeAdministrar(): boolean {
    return this.authService.tieneRol(['admin']);
  }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.cargando = true;
    this.cursoService.listar().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = 'No se pudieron cargar los cursos.';
        this.cargando = false;
      },
    });
  }

  eliminar(curso: Curso): void {
    if (!curso.id) return;
    const confirmado = confirm(`¿Eliminar el curso "${curso.nombre}"?`);
    if (!confirmado) return;

    this.cursoService.eliminar(curso.id).subscribe({
      next: () => {
        this.cursos = this.cursos.filter((c) => c.id !== curso.id);
      },
      error: () => {
        this.errorMensaje = 'No se pudo eliminar el curso.';
      },
    });
  }
}

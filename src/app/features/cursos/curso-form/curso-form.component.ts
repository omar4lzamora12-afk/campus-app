import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../../core/services/curso.service';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './curso-form.component.html',
})
export class CursoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cursoService = inject(CursoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cursoId: number | null = null;
  modoEdicion = false;
  guardando = false;
  errorMensaje = '';

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    descripcion: [''],
    creditos: [3, [Validators.required, Validators.min(1)]],
    cupoMaximo: [30, [Validators.required, Validators.min(1)]],
    activo: [true],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cursoId = Number(idParam);
      this.modoEdicion = true;
      this.cargarCurso(this.cursoId);
    }
  }

  cargarCurso(id: number): void {
    this.cursoService.obtenerPorId(id).subscribe({
      next: (curso) => {
        this.form.patchValue({
          nombre: curso.nombre,
          codigo: curso.codigo,
          descripcion: curso.descripcion,
          creditos: curso.creditos,
          cupoMaximo: curso.cupoMaximo,
          activo: curso.activo,
        });
      },
      error: () => {
        this.errorMensaje = 'No se pudo cargar la información del curso.';
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const valores = { ...this.form.getRawValue(), profesorId: null };

    const operacion = this.modoEdicion
      ? this.cursoService.actualizar(this.cursoId!, valores)
      : this.cursoService.crear(valores);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/cursos']);
      },
      error: () => {
        this.guardando = false;
        this.errorMensaje = 'No se pudo guardar el curso. Verifica los datos.';
      },
    });
  }
}

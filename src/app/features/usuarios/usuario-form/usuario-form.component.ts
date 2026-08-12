import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-form.component.html',
})
export class UsuarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  usuarioId: number | null = null;
  modoEdicion = false;
  guardando = false;
  errorMensaje = '';

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['estudiante' as 'admin' | 'profesor' | 'estudiante', Validators.required],
    activo: [true],
    password: [''],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.usuarioId = Number(idParam);
      this.modoEdicion = true;
      this.form.controls.password.clearValidators();
      this.cargarUsuario(this.usuarioId);
    } else {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(4)]);
    }
  }

  cargarUsuario(id: number): void {
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (usuario) => {
        this.form.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          activo: usuario.activo,
        });
      },
      error: () => {
        this.errorMensaje = 'No se pudo cargar la información del usuario.';
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const valores = this.form.getRawValue();

    const operacion = this.modoEdicion
      ? this.usuarioService.actualizar(this.usuarioId!, valores)
      : this.usuarioService.crear(valores);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/usuarios']);
      },
      error: () => {
        this.guardando = false;
        this.errorMensaje = 'No se pudo guardar el usuario. Verifica los datos.';
      },
    });
  }
}

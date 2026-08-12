import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuario-list.component.html',
})
export class UsuarioListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  cargando = true;
  errorMensaje = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = 'No se pudieron cargar los usuarios.';
        this.cargando = false;
      },
    });
  }

  eliminar(usuario: Usuario): void {
    if (!usuario.id) return;
    const confirmado = confirm(`¿Eliminar al usuario "${usuario.nombre}"?`);
    if (!confirmado) return;

    this.usuarioService.eliminar(usuario.id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
      },
      error: () => {
        this.errorMensaje = 'No se pudo eliminar el usuario.';
      },
    });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = this.authService.usuarioActual;

  // La navegación se arma dinámicamente según el rol: cada usuario solo ve
  // los enlaces a las secciones a las que el roleGuard le permitiría entrar.
  get puedeVerUsuarios(): boolean {
    return this.authService.tieneRol(['admin']);
  }

  get puedeVerCursos(): boolean {
    return this.authService.tieneRol(['admin', 'profesor', 'estudiante']);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

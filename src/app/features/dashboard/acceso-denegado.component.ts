import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card">
      <h2>Acceso denegado</h2>
      <p>Tu rol actual no tiene permisos para ver esta sección.</p>
      <a class="btn btn-primary" routerLink="/dashboard">Volver al panel principal</a>
    </div>
  `,
})
export class AccesoDenegadoComponent {}

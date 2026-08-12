export interface Curso {
  id?: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  profesorId: number | null;
  profesorNombre?: string;
  creditos: number;
  cupoMaximo: number;
  activo: boolean;
}

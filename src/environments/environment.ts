export const environment = {
  production: false,
  // Vacío a propósito: las peticiones salen como rutas relativas
  // (p.ej. /auth/login, /usuarios) y ng serve las redirige según
  // proxy.conf.json — /auth/* al servidor de login (puerto 3001) y
  // el resto a json-server (puerto 3000). Ver README para el detalle.
  apiUrl: '',
};

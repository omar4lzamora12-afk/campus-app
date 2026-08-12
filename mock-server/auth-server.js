/**
 * Servidor de autenticación mínimo para pruebas locales.
 *
 * Sirve un único endpoint, POST /auth/login, que valida las credenciales
 * contra la lista de USUARIOS de abajo y responde exactamente en el
 * formato que espera AuthService: { token, usuario }.
 *
 * Este servidor NO reemplaza a json-server: json-server sigue sirviendo
 * /usuarios y /cursos (puerto 3000). Este script corre en un puerto
 * distinto (3001) y el navegador nunca lo ve directamente porque Angular
 * llama siempre a environment.apiUrl (ver nginx/proxy más abajo si se
 * quiere unificar en un solo puerto).
 *
 * Uso:
 *   npm install express jsonwebtoken cors   (dentro de mock-server/)
 *   node mock-server/auth-server.js
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SECRETO_JWT = 'clave-secreta-solo-para-pruebas-locales';

// Usuarios de prueba — deben coincidir en id/rol con los de db.json
const USUARIOS = [
  { id: 1, nombre: 'Ana Torres', email: 'admin@institucion.edu', password: 'admin123', rol: 'admin' },
  { id: 2, nombre: 'Luis Ramírez', email: 'profesor@institucion.edu', password: 'profe123', rol: 'profesor' },
  { id: 3, nombre: 'Carla Méndez', email: 'estudiante@institucion.edu', password: 'est123', rol: 'estudiante' },
];

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  const usuario = USUARIOS.find((u) => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  const payload = {
    sub: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
  };

  // Token válido por 2 horas, firmado con el secreto de arriba.
  const token = jwt.sign(payload, SECRETO_JWT, { expiresIn: '2h' });

  res.json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: true,
    },
  });
});

const PUERTO = 3001;
app.listen(PUERTO, () => {
  console.log(`Servidor de autenticación escuchando en http://localhost:${PUERTO}`);
  console.log('Endpoint disponible: POST /auth/login');
});

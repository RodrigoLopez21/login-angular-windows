import path from 'path';
import dotenv from 'dotenv';

// Carga las variables de entorno ANTES que cualquier otra cosa.
// Esto es crucial para que el resto de la aplicación tenga acceso a process.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Server from './models/server';
// Inicia el servidor
const server = new Server();
server.initialize(); // Usamos el método initialize para conectar a la DB antes de escuchar
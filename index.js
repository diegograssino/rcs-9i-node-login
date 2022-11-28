// Pasos para comenzar un proyecto con Node+Express+MongoDb:
// a) Creo el repositorio
// b) Creo la carpeta localmente, ingreso a la misma, copio y pego los comandos que me da github. Ahora el proyecto ya tiene git y está asociado a nuestro repo.
// c) Inicializo con npm para generar nuestra estructura para instalar dependencias: "npm init", creo el .gitignore, utilizar este ejemplo en caso de no saber que agregar: https://github.com/github/gitignore/blob/main/Node.gitignore
// d) Le doy enter a todo y luego edito el package.json, agrego en scripts lo siguiente: "dev": "nodemon index.js",
// e) Instalo dependencias normalmente necesarias: "npm install cors dotenv express mongoose jsonwebtoken bcryptjs" y "npm install -D nodemon"
// f) DEPLOY --> Creo un archivo vercel.json, el mismo debe tener el siguiente contenido (reemplazar index.js si el archivo principal tiene otro nombre):
// {
//   "version": 2,
//   "builds": [
//     {
//       "src": "index.js",
//       "use": "@now/node"
//     }
//   ],
//   "routes": [
//     {
//       "src": "/(.*)",
//       "dest": "index.js"
//     }
//   ]
// }
// g) DEPLOY --> Agrego en el package.json la siguiente linea en scripts: "start": "node index.js",

// Luego, sigo los siguientes pasos:
// 1) Configuración de express, nos ayudará a que la implementación sea un poco más simple.
const express = require('express');
const app = express();

// 3) Configuración del parser de express, sino tendré problemas en poder leer los body al recibirlos.
app.use(express.json());

// 4) Configuración de dotenv, con esto podremos tener valores aislados completamente del código algo MUY NECESARIO por temas de seguridad.
require('dotenv').config();

// 5) Configuración de mongoose, este middleware nos simplificará la interacción con MongoDb.
const mongoose = require('mongoose');
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection OK'))
  .catch(error => console.error(error));

// 6) Dejo seteado en una constante el puerto, usar el que este en el env, sino usará 8000, esto será necesario para cuando haga el deploy (dicho servicio será el que maneje el port).
const PORT = process.env.PORT || 8000;

// 7) Configuracion de CORS (para evitar errores de comunicación entre origenes diferntes)
var cors = require('cors');
app.use(cors());

// 8) Empiezo a programar los endopoints, genero un archivo para cada uno en la carpeta routes y los voy trayendo, tener en cuenta ya ir teniendo los modelos armados.
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// 2) Esta funcion es la que corre la API, si no está, no se autoejecuta.
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

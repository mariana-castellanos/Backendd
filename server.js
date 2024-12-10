require('dotenv').config();
const express = require ("express")
const inventarioRoutes = require('./src/inventario/routes')
const autenticacion = require('./src/auth/routes')
const domicilios = require('./src/domicilios/routes')
const usuario = require('./src/usuario/routes')
const cors = require("cors");
const passport = require('passport');
require("./src/auth/passportConfig");

const session = require("express-session"); 

const app = express();
const PORT = 8080;

// Configurar express-session
app.use(session({
    secret: 'llave_secreta', // Reemplaza 'your_secret_key' por una clave secreta que solo tú conozcas
    resave: false, // No volver a guardar la sesión si no ha sido modificada
    saveUninitialized: true, // Guardar sesiones nuevas que no hayan sido inicializadas
    cookie: { secure: false } // Si estás en producción, cambia a true y usa HTTPS
  }));

app.use(cors({
    origin: 'http://localhost:3000',
  }));
app.use(express.json());

app.use('/api/v1/inventario', inventarioRoutes);
app.use('/api/v1/auth', autenticacion);
app.use(passport.initialize());
app.use(passport.session()); 
app.use('/api/v1/pedidos', domicilios);
app.use('/api/v1/usuario', usuario)

app.get("/api/home", (req,res) => {
    res.json({message: "Hello World"});
});



app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});
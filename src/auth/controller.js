const pool = require('../../db')
const googleQueries = require('./googleQueries')
const queries = require("./queries")
const passport = require("passport");
const crypto = require('crypto')
const nodemailer = require ('nodemailer')
const bcrypt = require("bcryptjs");

const login = async (req,res) => {
    const {email, password} = req.body;

    try{
        const existUsuario = await pool.query(queries.getUser,  [email]);
        
        if (existUsuario.rows.length ===0) {
            
        return res.status(400).json({message: "Credenciales incorrectas" + email})
        }
        if (password === existUsuario.rows[0].contraseña) {
            const userData = {
                id_usuario: existUsuario.rows[0].id,
                name: existUsuario.rows[0].nombre,
                role: existUsuario.rows[0].rol
            };
            console.log ("Inicio de sesion exitoso")
           res.status(200).json({message: "Inicio de sesion exitoso",
            userData,
           })
        } else {
            res.status(400).json({message: "Contraseña incorrecta"})
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({message: "Error en el servidor"});
    }
};

const register = async (req, res) => {
    const { nombre, email, password,  lastName, address, cel, role = 'cliente' } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const existUsuario = await pool.query(queries.getUser, [email]);
      
      if (existUsuario.rows.length > 0) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
  
      // Insertar el nuevo usuario en la base de datos
      

      const newUser = await pool.query(queries.createUser, [nombre, email, password,  lastName, address, cel, role]);
    
      console.log("Usuario registrado exitosamente");
      res.status(201).json({
        message: "Usuario registrado exitosamente",
        userData: newUser.rows[0],  // Retorna los datos del nuevo usuario
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    } 
  };

 // Lógica para el login con Google
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Callback después de que Google devuelva el perfil del usuario
const googleCallback = async (req, res) => {
  try {
    const { id, correo, nombre } = req.user; // Datos proporcionados por Google

   
    // Verificar si el usuario ya existe en la base de datos
    let userResult = await googleQueries.getUser(correo);
    if (!userResult) {
      // Si el usuario no existe, lo creamos con el rol por defecto 'cliente' y sin contraseña
      const newUserResult = await googleQueries.createUser(
        nombre, // Nombre del usuario
        correo, // Correo del usuario
        "", // Contraseña vacía, ya que es un login con Google
        "cliente" // Rol por defecto
      );

      userResult = newUserResult;
    }

    const user = userResult;
    // Aquí puedes crear una sesión o devolver un token JWT
    const frontendRedirectURL = `http://localhost:3000/loginSuccess?user=${encodeURIComponent(JSON.stringify(user))}`;
    return res.redirect(frontendRedirectURL);

  } catch (error) {
    console.error("Error en Google login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const userResult = await pool.query(queries.getUser, [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar un token de recuperación de contraseña
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora de expiración

    // Guardar el token en la base de datos
    await pool.query(queries.savePasswordResetToken, [
      token,
      tokenExpiration,
      email,
    ]);

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Puedes cambiar el servicio de correo según lo que uses
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER, // Añade estas variables de entorno en un archivo .env
        pass: process.env.EMAIL_PASS,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      },
    });

    // Enviar el correo de recuperación
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla: http://localhost:3000/reset-password?token=${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verificar si el token es válido
    const userResult = await pool.query(queries.getUserByToken, [token]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Encriptar la nueva contraseña
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña del usuario en la base de datos
    await pool.query(queries.updatePassword, [password, token]);

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};



 module.exports = {
    login,
    register,
    googleAuth,
    googleCallback,     
    forgotPassword,
    resetPassword
 }
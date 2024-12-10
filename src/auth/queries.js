const getUser = "SELECT * FROM usuarios WHERE correo = $1;"
const createUser = `
    INSERT INTO usuarios (nombre, correo, contraseña,  apellido, direccion, cel, rol) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *; `;

const savePasswordResetToken = `
  UPDATE usuarios
  SET reset_token = $1, reset_token_expiration = $2
  WHERE correo = $3
`;

const getUserByToken = `
  SELECT * FROM usuarios WHERE reset_token = $1;
`;

const updatePassword = `
  UPDATE usuarios 
  SET contraseña = $1, reset_token = NULL -- Limpiar el token después de usarlo
  WHERE reset_token = $2;
`;

module.exports = {
    getUser,
    createUser,
    savePasswordResetToken,
    getUserByToken,
    updatePassword
}
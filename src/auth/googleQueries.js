const pool = require('../../db'); // Importa la configuración de tu conexión a la base de datos

// Obtener usuario por correo electrónico
const getUser = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [email]);
    return result.rows[0]; // Devuelve el usuario encontrado o undefined si no existe
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};

// Crear un nuevo usuario en la base de datos
const createUser = async ({ nombre, email, rol }) => {
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, correo, rol) VALUES ($1, $2, $3) RETURNING *",
      [nombre, email, rol]
    );
    return result.rows[0]; // Devuelve el usuario recién creado
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

// Obtener usuario por ID
const getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
    return result.rows[0]; // Devuelve el usuario con el ID proporcionado
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw error;
  }
};

module.exports = {
  getUser,
  createUser,
  getUserById,
};

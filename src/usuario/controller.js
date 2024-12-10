const pool = require('../../db'); // Aquí importa tu conexión a la base de datos
const queries = require("./queries");

const getInfoUsuario = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID del usuario desde los parámetros

  try {

    const result = await pool.query(queries.getUsuarioById, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(result.rows[0]); // Enviamos el primer resultado
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, cel, correo, doc, direccion } = req.body;
    
    try {
      // Validar si el usuario existe
      const userExists = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  
      if (userExists.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Actualizar los datos
      const result = await pool.query(queries.updateUser, [
        nombre,
        apellido,
        cel,
        correo,
        doc,
        direccion,
        id,
      ]);
      console.log("la respuesta al actualizar es esta: "+ result.rows[0])
  
      res.status(200).json({
        message: 'Usuario actualizado exitosamente',
        user: result.rows[0],
      });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

module.exports = {
  getInfoUsuario,
  updateUser,
};
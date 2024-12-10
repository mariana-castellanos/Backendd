const getUsuarioById = `
  SELECT nombre, apellido, cel, correo, doc, direccion 
  FROM usuarios 
  WHERE id = $1;
`;

const updateUser = `
  UPDATE usuarios
  SET 
    nombre = $1,
    apellido = $2,
    cel = $3,
    correo = $4,
    doc = $5,
    direccion = $6
  WHERE id = $7
  RETURNING *;
`;

module.exports = {
  getUsuarioById,
  updateUser,
};


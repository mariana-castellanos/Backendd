const { Router } = require('express');
const router = Router();
const { getInfoUsuario, updateUser } = require("./controller");

router.get('/usuario/:id', getInfoUsuario);
router.put('/update/:id' , updateUser )

module.exports = router;
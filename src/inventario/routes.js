const { Router } = require ('express')
const controller = require('./controller')
const router = Router();

router.get('/', controller.getInventario)

module.exports = router;
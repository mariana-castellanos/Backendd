const { Router } = require ('express')
const controller = require('./controller')
const router = Router();

router.post("/login", controller.login)
router.post('/register', controller.register);

// Ruta para iniciar la autenticación con Google
router.get("/google", controller.googleAuth);
// Ruta de callback después de la autenticación
router.get("/google/callback", controller.googleAuth, controller.googleCallback);

router.post('/forgot-password', controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
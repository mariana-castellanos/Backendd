const { Router } = require('express');
const { createPedido, getPedidosDomiciliario, getPedidosCliente, getPedidoDetalles } = require('./controller');
const router = Router();
const { updatePedido } = require("./controller");

router.post('/checkout', createPedido);
router.get('/pedidos', getPedidosDomiciliario);
router.get('/pedidos_cliente', getPedidosCliente);
router.put("/update/:id", updatePedido);
router.get('/detalles/:id_pedido', getPedidoDetalles);

module.exports = router;
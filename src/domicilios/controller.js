const { use } = require('passport');
const pool = require('../../db');
const queries = require('./queries');
const nodemailer = require ('nodemailer')

// Crear pedido
const createPedido = async (req, res) => {
    const { cart, total, id_usuario } = req.body; // El carrito con productos y el total
    
    try {
        // Buscar el domiciliario con menos pedidos
        const domiciliario = await pool.query(queries.getDomiciliarioMenosPedidos);
        if (!domiciliario.rows.length) {
            return res.status(400).json({ message: "No hay domiciliarios disponibles" });
        }
        const id_domiciliario = domiciliario.rows[0].id;

        // Insertar el pedido
        const pedidoResult = await pool.query(queries.createPedido, [id_usuario, id_domiciliario, total]);
        const id_pedido = pedidoResult.rows[0].id_pedido;

        // Insertar los productos del pedido
        for (const producto of cart) {
            await pool.query(queries.addProductoToPedido, [producto.id_producto, id_pedido, producto.cantidad, producto.precio_producto]);
        }

        // Incrementar el número de pedidos del domiciliario
        await pool.query(queries.incrementarPedidosDomiciliario, [id_domiciliario]);

        res.status(200).json({ message: "Pedido creado exitosamente" });
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        res.status(500).json({ message: "Error al crear el pedido" });
    }
};


const getPedidosDomiciliario = async (req, res) => {
    const { id_domiciliario, estado } = req.query;
  
    try {
      const results = await pool.query(queries.getPedidosByDomiciliario, [id_domiciliario, estado]);
      res.status(200).json(results.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
  };

  const getPedidosCliente = async (req, res) => {
    const { id_domiciliario, estado } = req.query;
  
    try {
      const results = await pool.query(queries.getPedidosByCliente, [id_domiciliario, estado]);
      res.status(200).json(results.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
  };

  const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // Recibimos el nuevo estado del frontend
  
    try {
      const result = await pool.query(
        queries.updateStadoPedido,
        [estado, id]
      );

  
      if (result.rowCount > 0) {
        if (estado === 'entregado'){
          const user = await pool.query(
            queries.getEmailByIdPedido,
            [id]
          );
          if (!user){
            console.log("no se enocntró el usuario")
          }else {
            const clienteCorreo =  user.rows[0].correo;
            const clienteNombre = user.rows[0].nombre;
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
            
            const mailOptions = {
              
              from: process.env.EMAIL_USER,
              to: clienteCorreo,
              subject: 'Pedido con id: '+ id +' entregado',
              text: 'Buen día señor(a) '+clienteNombre+' le informamos que su pedido con id: '+id+' ha sido entregado',
              attachments: [{
                filename: 'image.png',
                path: './database/images/Logosss.png',
                cid: 'imagen'
            }],
              html:  `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <p>Buen día señor(a) <strong>${clienteNombre}</strong>,</p>
                <p>Le informamos que su pedido con ID: <strong>${id}</strong> ha sido entregado.</p>
                <img src="cid:imagen" alt="Logo" style="display: block; margin: 20px auto; width: 100px; height: auto;">
                <p style="margin-top: 20px;">Gracias por confiar en nosotros.</p>
                <p>Atentamente,</p>

                <p><strong>Papeleria Omega</strong><br>
                Carrera 100 #139<br>
                Teléfono: +57 123456789<br>
                Email: mcassal14@gmail.com</p>
              </div>
            `,
            };

            await transporter.sendMail(mailOptions)
          }
        }
        res.status(200).json({ message: "Pedido actualizado correctamente" });
      } else {
        res.status(404).json({ message: "Pedido no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  

  const getPedidoDetalles = async (req, res) => {
    const { id_pedido } = req.params;
    try {
        const result = await pool.query(queries.getPedidoDetalles, [id_pedido]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Estructuramos la respuesta agrupando los productos en un array
        const pedido = {
            id_pedido: result.rows[0].id_pedido,
            fecha: result.rows[0].fecha,
            total: result.rows[0].total,
            cliente_nombre: result.rows[0].cliente_nombre,
            cliente_telefono: result.rows[0].cliente_telefono,
            cliente_direccion: result.rows[0].cliente_direccion,
            productos: result.rows.map(row => ({
                nombre_producto: row.nombre_producto,
                cantidad: row.cantidad,
                precio: row.precio
            }))
        };

        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del pedido' });
    }
};


module.exports = {
    createPedido,
    getPedidosDomiciliario,
    updatePedido,
    getPedidosCliente,
    getPedidoDetalles
};
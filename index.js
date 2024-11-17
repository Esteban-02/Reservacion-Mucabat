const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); // Asegúrate de instalar mysql2 con `npm install mysql2`
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

// Configuración de la base de datos
const db = mysql.createPool({
    host: 'localhost', // Cambia estos datos según tu configuración de base de datos
    user: 'root',
    password: 'root',
    database: 'mucabat_db'
});
console.log("Hola, mundo!");
// Configura la carpeta 'public' para archivos estáticos
app.use(express.static('public'));

// Middleware para manejar datos JSON y de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta principal para renderizar el formulario
app.get('/', (req, res) => {
    res.render('reserva'); // Renderiza la vista 'reserva' desde la carpeta 'views'
});

// Ruta para manejar el formulario de reservación
app.post('/reservar', async (req, res) => {
    try {
        const { nombre_apellido, razon_social, zona, num_personas, fecha, correo_electronico } = req.body;

        // Guardar los datos en la base de datos con estado inicial "pendiente"
        const [result] = await db.query(
            'INSERT INTO reservas (nombre_apellido, razon_social, zona, num_personas, fecha, correo_electronico) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_apellido, razon_social, zona, num_personas, fecha, correo_electronico]
        );

        // Enviar respuesta con éxito y el ID de la reservación
        res.json({ success: true, message: "Su solicitud de reservación está en proceso, espera un correo confirmando su reservación.", idReservacion: result.insertId });
    } catch (error) {
        console.error("Error al guardar la reservación:", error);
        res.json({ success: false, message: "Hubo un problema al realizar la reservación. Inténtelo nuevamente." });
    }
});


app.get('/', (req, res) => {
    res.render('reserva');
});
// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    service: 'Gmail', // o el proveedor de correo que uses
    auth: {
        user: 'estebanj.ortegat@gmail.com', // Reemplaza con tu correo
        pass: 'cxme gqyh rsyg myjs'       // Contraseña del correo
    },
    tls: {
        rejectUnauthorized: false // Ignorar certificados no válidos
    }

});

// Ruta para aprobar la reservación y enviar el correo
app.post('/aprobar-reservacion', async (req, res) => {
    const { correo, idReservacion, nombre, fecha } = req.body;

    console.log("Correo reservacion")
    // Mensaje del correo
    const mailOptions = {
        from: 'estebanj.ortegat@gmail.com',
        to: correo,
        subject: 'Solicitud aprobada',
        text: `Hola ${nombre}, \nTu solicitud con ID: ${idReservacion} ha sido aprobada. \nGracias por confiar en nosotros.
        \nEl café es un bálsamo para el corazón y el espíritu.
        \nGiuseppe Verdi`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado")

    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Hubo un error al enviar el correo');
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

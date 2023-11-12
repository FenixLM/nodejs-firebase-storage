const express = require('express');
const admin = require('firebase-admin');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const serviceAccount = require('./credentials.json');
const cors = require('cors');

const app = express();
const port = 3000;

// Inicializa la aplicación de administración de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://LINK_BUCKET', // Reemplaza con la URL del bucket de almacenamiento de Firebase
});

const bucket = admin.storage().bucket();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(fileUpload());

// Ruta para subir una imagen
app.post('/upload', async (req, res) => {
    console.log('body', req.body);
    console.log('imagenes', req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se ha enviado ninguna imagen.');
    }

    const image = req.files.image;
    const uploadPath = path.join(__dirname, 'uploads', image.name);

    // Mueve el archivo al directorio de subidas
    image.mv(uploadPath, async (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Sube la imagen al almacenamiento de Firebase
        const remotePath = `images/${image.name}`;
        const dataImage = await bucket.upload(uploadPath, { destination: remotePath });
        console.log('dataImage', dataImage);

        // Elimina el archivo local después de subirlo a Firebase
        fs.unlinkSync(uploadPath);

        res.send('Imagen subida y almacenada en Firebase exitosamente');
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});




const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

mongoose
.connect(process.env.DATABASE)
.then(() => {
    console.log('Conectado a la base de datos')
})
.catch((error) => {
    console.log(error);
});

mongoose.connection.on('error', (error) => {
    console.log(error);
})

// impportar modelos
require('../models/Usuarios');
require('../models/Vacantes');

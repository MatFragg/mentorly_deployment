const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async (req,res) => {
    const vacantes = await Vacante.find().lean();

    if(!vacantes) return next();

    res.render('home',{
        nombrePagina: 'Mentorly',
        tagline: 'Encuentra y Pública diversos tipos de Trabajo',
        barra: true,
        boton: true,
        vacantes
    })
}
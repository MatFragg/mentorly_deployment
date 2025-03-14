const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const multer = require('multer');
const shortid = require('shortid');
const { cerrarSesion } = require('./authController');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre:req.user.nombre,
        imagen: req.user.imagen,
    });
}
    
// Adds a vacant to the Data Base
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);

    // User author of the vacancy
    vacante.autor = req.user._id;

    // Create skills array
    vacante.skills = req.body.skills.split(',');
    
    
    // Store in the Data Base
    const nuevaVacante = await vacante.save();

    // Redirect 
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

// Show a vacant 
exports.mostrarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url}).lean().populate('autor');

    // If there are no results
    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    });
}

exports.formEditarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url}).lean();

    if(!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre:req.user.nombre,
        mensajes: req.flash(),
        imagen: req.user.imagen,
    });
}

exports.editarVacante = async (req, res) => {
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(','); // Create skills array

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteActualizada, {
        new: true,
        runValidators: true
    });
    res.redirect(`/vacantes/${vacante.url}`);
}

// Validate and sanitize the new vacant
exports.validarVacante = (req, res,next) => {
    // Sanitize the fields
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    // Validate
    req.checkBody('titulo', 'Agrega un título a la vacante').notEmpty();
    req.checkBody('empresa', 'Agrega una empresa').notEmpty();
    req.checkBody('ubicacion', 'Agrega una ubicación').notEmpty();
    req.checkBody('contrato', 'Selecciona el tipo de contrato').notEmpty();
    req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty();

    const errores = req.validationErrors();
    if(errores){
        // Reload the view with the errors
        req.flash('error', errores.map(error => error.msg));
        res.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion:true,
            nombre:req.user.nombre,
            mensajes: req.flash()
        });
        return;
    }
    next(); // Everything is fine, continue to the next middleware
}

// Delete Vacants  
exports.eliminarVacante = async (req, res) => {
    const { id } = req.params;

    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante, req.user)){
        // Everything is fine, delete the vacant
        await vacante.deleteOne();
        res.status(200).send('Vacante Eliminada Correctamente');
    } else {
        // Not authorized
        res.status(403).send('Error');
    }
}

// Verifies if the user is the author of the vacant
const verificarAutor = (vacante = {}, usuario = {}) => {
    if(!vacante.autor.equals(usuario._id)){
        return false;
    }
    return true;
}

// Upload the CV in PDF
exports.subirCV = (req,res,next) => {
    upload(req,res, function(error) {
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error','El archivo es muy grande: Máximo 100kb');
                } else {
                    req.flash('error',error.message);
                }
            } else {
                req.flash('error',error.message);
            }
            res.redirect('back');
            return;
        } else {
            // return next returns an error message
            return next();
        }
    });
}

// Multer configuration
const configuracionMulter = {
    limits: {fileSize: 500000},
    storage: filestorage = multer.diskStorage({
        destination: (req,file,cb) =>{
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename: (req,file,cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'application/pdf'){
            // the cb is executed as true or false : true when the image is accepted
            cb(null, true);
        } else {
            // New Error creates a new error and error.message is the message that will be displayed
            cb(new Error('Formato No Valido'),false);
        }
    },
}

const upload = multer(configuracionMulter).single('cv');

exports.contactar = async (req,res,next) => {
    // Store the candidate's data
    const vacante = await Vacante.findOne({url: req.params.url});

    // if a vacant doesn't exist
    if(!vacante) return next();

    // If a vacant exists , build the new object
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        cv: req.file && req.file.filename
    }

    /// store the vacant
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    // flash msg and redirect
    req.flash('correcto','Se envió tu CV correctamente');
    res.redirect('/');
}

exports.mostrarCandidatos = async (req,res,next) => {
    const vacante = await Vacante.findById(req.params.id).lean();
    
    if(!vacante) return next();

    if(vacante.autor != req.user._id.toString()){
        return next();
    }
    
    res.render('candidatos',{
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos : vacante.candidatos
    });
}

// Search Vacants
exports.buscarVacantes = async (req,res) => {
    const vacantes = await Vacante.find({
        $text: {
            $search: req.body.q
        }
    }).lean();

    // Show the vacants
    res.render('home',{
        nombrePagina: `Resultados para la búsqueda: ${req.body.q}`,
        barra: true,
        vacantes
    });
}
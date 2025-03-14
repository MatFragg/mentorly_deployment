const mongoose = require('mongoose');
const multer = require('multer');
const Usuarios = mongoose.model('Usuarios');
const shortid = require('shortid');

exports.subirImagen = (req, res, next) => {
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
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }
    });
}

// Multer configuration
const configuracionMulter = {
    limits: {fileSize: 300000},
    storage: filestorage = multer.diskStorage({
        destination: (req,file,cb) =>{
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename: (req,file,cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            // the cb is executed as true or false
            cb(null, true);
        } else {
            cb(new Error('Formato No Valido'),false);
        }
    },
}

const upload = multer(configuracionMulter).single('imagen');


exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en Mentorly',
        tagline: 'Comienza a publicar tus vacantes gratis, solo necesitas una cuenta'
    })
}

exports.validarRegistro = (req, res, next) => {
    // sanitze is f
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    // validation
    req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser válido').isEmail();
    req.checkBody('password', 'El password no puede ir vacío').notEmpty();
    req.checkBody('confirmar', 'Confirmar password no puede ir vacío').notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    const errores = req.validationErrors();

    if(errores){
        // If There are errors
        req.flash('error', errores.map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en Mentorly',
            tagline: 'Comienza a publicar tus vacantes gratis, solo necesitas una cuenta',
            mensajes: req.flash()
        });
        return;
    }
    // If the whole validation is correct    
    next();
}

exports.crearCuenta = async (req, res,next) => {
    // Create User
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        req.flash('correcto', 'Usuario creado correctamente');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error);
    }

}

// formular login
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión en Mentorly'
    })
}

// Form Edit Profile
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en Mentorly',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre:req.user.nombre,
        imagen: req.user.imagen    
    });
}

// Verify and SAnitize the edit profile form
exports.validarPerfil = (req, res, next) => {
    // Sanitize
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }

    // Validate
    req.checkBody('nombre', 'El nombre no puede ir vacío').notEmpty();
    req.checkBody('email', 'El email no puede ir vacío').notEmpty();

    const errores = req.validationErrors();

    if(errores){
        req.flash('error', errores.map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en Mentorly',
            usuario: req.user.toObject(),
            cerrarSesion: true,
            nombre:req.user.nombre,
            mensajes: req.flash()
        });
        return;
    }
    next();
}

//Save changes in the profile
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.descripcion = req.body.descripcion;
    if(req.body.password){
        usuario.password = req.body.password;
    }

    if(req.file){
        usuario.imagen = req.file.filename;
    }

    await usuario.save();

    req.flash('correcto', 'Cambios guardados correctamente');
    // redirect
    res.redirect('/administracion');
}

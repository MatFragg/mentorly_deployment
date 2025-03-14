const passport = require('passport');
const mongoose = require('mongoose');
const Vacantes = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
});

// Check if the user is authenticated
exports.verificarUsuario = (req, res, next) => {
    // Review the user
    if(req.isAuthenticated()){
        return next(); // User is authenticated
    }

    // Redirect to the form
    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async(req, res) => {
    // consult the user authenticated
    const vacantes = await Vacantes.find({autor: req.user._id}).lean();

    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y administra tus vacantes desde aquí',
        cerrarSesion: true,
        nombre:req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        req.flash('correcto', 'Cerraste sesión correctamente');
        return res.redirect('/iniciar-sesion');
    });
}

// Reset Password
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer-password',{
        nombrePagina: 'Reestablecer tu contraseña',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu contraseña, coloca tu email'
    })
}

// Generate token in case the user exists
exports.enviarToken = async(req, res) => {
    const user = await Usuarios.findOne({email:req.body.email});

    if(!user){
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // If User exists, generate token
    user.token = crypto.randomBytes(20).toString('hex');
    user.expira = Date.now() + 3600000;

    // save the user
    await user.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${user.token}`;
    //console.log(resetUrl);

    // Send notification by email
    await enviarEmail.enviar({
        user,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto', 'Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
}

// Validates if the token is valid and user exists , it shows the view
exports.reestablecerPassword = async(req,res) => {
    const user = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if(!user) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // If everything is ok , show the form
    res.render('nuevo-password',{
        nombrePagina: 'Nueva Contraseña'
    })
}

// Store the new password in the DB
exports.guardarPassword = async(req,res) => {
    const user = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });


    // User does not exist or token is invalid
    if(!user) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // assign new password , clean token and expira
    user.password = req.body.password;
    user.token = undefined;
    user.expira = undefined;

    // save new password in Database
    await user.save();
    req.flash('correcto', 'Contraseña modificada correctamente');
    res.redirect('/iniciar-sesion');
}
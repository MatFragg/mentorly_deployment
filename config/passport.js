const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, done) => {
    const user = await Usuarios.findOne({email });

    if(!user) return done(null, false, {
        message: 'Usuario no existe'
    });

    // User exists, verify password
    const verificarPassword = user.compararPassword(password);
    if(!verificarPassword)return done(null, false, {
        message: 'Password incorrecto'
    });

    return done(null, user);
}))

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async(id, done) => {
    const user = await Usuarios.findById(id).exec();
    return done(null,user);
})

module.exports = passport;
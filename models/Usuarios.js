const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
});

// Method to hash passwords
usuarioSchema.pre('save', async function(next) {
    // if password is already hashed
    if(!this.isModified('password')) {
        return next(); // stop the function
    }
    // If password is not hashed
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
});


//Sends an alert when an user is alredy registered
usuarioSchema.post('save', function(error, doc, next) {
    if(error.name === 'MongoError' && error.code === 11000){
        next('Este correo ya esta registrado');
    }else{
        next(error);
    }
});

// Authenticate users
usuarioSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password,this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuarioSchema);


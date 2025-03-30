// --- DEFINE EL MODELO DE LOS USUARIOS ---

const mongoose = require('mongoose')

const UserScheme = new mongoose.Schema(

    {
        name: String,
        age: Number,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }

)

// Middleware para cifrar la contraseña antes de guardarla
UserScheme.pre('save', function (next) {
    if (!this.isModified('password')) return next(); // Evita volver a cifrar si la contraseña no cambió

    // Genremos una nueva semilla.
    this.salt = crypto.randomBytes(16).toString('hex'); 
    
    // Ahora ciframos la contraseña.
    this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 64, 'sha512').toString('hex'); // Cifra la contraseña

    next();

});

// Método para verificar la contraseña.
UserScheme.methods.comparePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.password === hash;
};

const User = mongoose.model('User', UserScheme);
module.exports = User;
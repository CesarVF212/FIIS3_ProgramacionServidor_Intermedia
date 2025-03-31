const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
    {
        name: String,
        age: Number,
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: { type: String, required: true },
        salt: { type: String }, // Necesario para la encriptación

        role: {
            type: String,
            enum: ['user', 'admin'], // Enum para restringir valores
            default: 'user'
        },

        emailVerification: {
            verificationCode: { type: String },
            verified: { type: Boolean, default: false },
            verificationAttempts: { type: Number, default: 3 }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Middleware para cifrar la contraseña antes de guardarla
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next(); // Evita volver a cifrar si la contraseña no cambió

    this.salt = crypto.randomBytes(16).toString('hex'); // Genera un salt aleatorio
    this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 64, 'sha512').toString('hex'); // Cifra la contraseña

    next();
});

// Método para verificar la contraseña
UserSchema.methods.comparePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.password === hash;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

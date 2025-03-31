const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken'); // Para generar el token
const crypto = require("crypto"); // Para cifrar contraseñas
const { handleHttpError } = require("../utils/handleError");
const User = require("../models/users.js");

// Función para generar código de 6 dígitos
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Crear usuario con código de verificación
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const emailConflict = errors.array().find(err => err.msg === "El email ya está registrado");
        return handleHttpError(res, emailConflict ? "El email ya está registrado" : errors.array(), emailConflict ? 409 : 400);
    }

    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return handleHttpError(res, "El email ya está registrado", 409);
        }

        // Genera el código de verificación
        const verificationCode = generateVerificationCode();

        // Crea el usuario con el código de verificación
        user = new User({
            name,
            email,
            password,
            emailVerification: {
                verificationCode,
                verified: false
            }
        });

        await user.save();

        // Simulación de envío del código por email (debes usar nodemailer en producción)
        console.log(`Código de verificación para ${email}: ${verificationCode}`);

        const jsonUser = user.toJSON();

        if(jsonUser.jckToken === undefined){
            jsonUser.jckToken = null;
        }
        res.status(201).json({ 

            user: {
                name: jsonUser.name, 
                email: jsonUser.email,
                role: jsonUser.role,

                emailVerification: {
                    verified: jsonUser.emailVerification.verified,
                    verificationAttempts: jsonUser.emailVerification.verificationAttempts
                },

                jwkToken: jsonUser.jckToken,

            },
            message: "Usuario creado. Revisa tu email para verificar la cuenta." 
        });

    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al registrar usuario", 500);
    }
};

// Verificar el código de email
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return handleHttpError(res, "Usuario no encontrado", 404);
        }

        // Si el email ya está verificado
        if (user.emailVerification.verified) {
            return res.status(400).json({ message: "El email ya ha sido verificado." });
        }

        // Verifica si los intentos han agotado
        if (user.emailVerification.verificationAttempts <= 0) {
            // Cambiar el código de verificación si los intentos han fallado
            user.emailVerification.verificationCode = generateVerificationCode();
            user.emailVerification.verificationAttempts = 3; // Restablecer intentos
            await user.save();

            // Simulación de reenviar el código (en producción, usa nodemailer aquí)
            console.log(`Nuevo código de verificación para ${email}: ${user.emailVerification.verificationCode}`);

            return handleHttpError(res, "Has agotado tus intentos. Se ha enviado un nuevo código.", 403);
        }

        // Si el código es incorrecto, disminuir los intentos restantes
        if (user.emailVerification.verificationCode !== code) {
            user.emailVerification.verificationAttempts -= 1;
            await user.save();

            return handleHttpError(res, `Código incorrecto. Intentos restantes: ${user.emailVerification.verificationAttempts}`, 401);
        }

        // Si el código es correcto, marcar como verificado
        user.emailVerification.verified = true;
        user.emailVerification.verificationCode = null; // Limpiar código de verificación
        user.emailVerification.verificationAttempts = 3; // Restablecer intentos
        await user.save();

        // Responder con éxito y JWT
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, "secreto_super_seguro", { expiresIn: "2h" });
        res.json({ email: user.email, verified: user.emailVerification.verified, role: user.role, token });

    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al verificar el email", 500);
    }
};

// Método para iniciar sesión
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return handleHttpError(res, "Usuario no encontrado", 404);

        if (!user.emailVerification.verified) {
            return handleHttpError(res, "Debes verificar tu email antes de iniciar sesión.", 403);
        }

        // Verificar la contraseña
        if (!user.comparePassword(password)) {
            return handleHttpError(res, "Contraseña incorrecta", 401);
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, "secreto_super_seguro", { expiresIn: "2h" });

        res.json({ email: user.email, role: user.role, token });
    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al iniciar sesión", 500);
    }
};

// Obtener todos los usuarios
const getItems = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al obtener usuarios", 500);
    }
};

// Obtener un usuario por email
const getItem = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return handleHttpError(res, "Usuario no encontrado", 404);
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al obtener usuario", 500);
    }
};

// Actualizar un usuario
const updateItem = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        if (!user) {
            return handleHttpError(res, "Usuario no encontrado", 404);
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al actualizar usuario", 500);
    }
};

// Eliminar un usuario
const deleteItem = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });
        if (!user) {
            return handleHttpError(res, "Usuario no encontrado", 404);
        }
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al eliminar usuario", 500);
    }
};

module.exports = { 
    getItem, getItems, updateItem, createUser, deleteItem, loginUser, verifyEmail 
};

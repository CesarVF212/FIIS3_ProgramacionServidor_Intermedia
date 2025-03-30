// --- DEFINE EL CONTROLADOR PARA MANEJAR LAS OPERACIONES SOBRE LA BASE DE DATOS DE USUARIOS ---

const { validationResult } = require("express-validator"); // Librería validadora.
const { handleHttpError } = require("../utils/handleError"); // Archivo para manejar errores.
const User = require("../models/users.js");  // Modelo de usuarios.

// Creación de un nuevo usuario.
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Revisa si el error es relacionado al email ya registrado
        const emailConflict = errors.array().find((err) => err.msg === "El email ya está registrado");

        if (emailConflict) {
            // Si es un conflicto con el email, retorna 409
            return handleHttpError(res, "El email ya está registrado", 409);
        }

        // Para otros errores de validación, retorna 400
        return handleHttpError(res, errors.array(), 400);
    }

    try {
        const { name, email, password } = req.body;

        // Creación del usuario
        const newUser = new User({
            name,
            email,
            password,
        });

        // Guarda el usuario en la base de datos
        await newUser.save();

        // Responde con el nuevo usuario
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al crear el usuario", 500);
    }
};

module.exports = { createUser };

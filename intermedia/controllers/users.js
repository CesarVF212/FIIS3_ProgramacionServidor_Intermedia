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

// Crear un usuario
const createItem = createUser; // Ya lo tienes definido

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

// Metodo para iniciar sesión.
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Busca el usuario en la base de datos
        const user = await User.findOne({ email });
        if (!user)
            return handleHttpError(res, "Usuario no encontrado", 404);
        

        // Verifica la contraseña
        const isMatch = user.comparePassword(password);
        if (!isMatch)
            return handleHttpError(res, "Contraseña incorrecta", 401);
        

        res.json({ message: "Inicio de sesión exitoso", user });
    
    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al iniciar sesión", 500);
    }
};

module.exports = { getItem, getItems, updateItem, createItem, deleteItem, loginUser };

// --- DEFINE EL VALIDADOR DE LOS USUARIOS ---


const { check } = require("express-validator"); // Librería para validar datos en Express.
const User = require("../models/users"); // Importamos el modelo de usuarios.
const validateResults = require("../utils/handleValidator.js"); // Controlador de los validadores.

const validatorCreateItem = [

    // El nombre tiene es oblgatorio, no puede estar vacío y tiene que tener una longitud mínima de 5 caracteres y máxima de 90.
    check("name")
        .exists().withMessage("El nombre de usuario es obligatorio")
        .notEmpty().withMessage("El nombre del usuario no puede estar vacío")
        .isString().withMessage("El nombre del usuario debe ser un string")
        .isLength({ min: 5 }).withMessage("El nombre del usuario es muy corto")
        .isLength({ max: 90 }).withMessage("El nombre del usuario es muy largo"),

    // El email es obligatorio, no puede estar vacío y tiene que ser un email válido.
    // Si el email ya existe, lanzamos un error con el código 409.
    check("email")
        .exists().withMessage("El email es obligatorio")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no es válido")
        .custom(async (value) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) {
                // Lanzamos un error con el código 409 si el email ya existe
                return Promise.reject("El email ya está registrado");
            }
            return true;
        }),

    // La contraseña es obligatoria, no puede estar vacía y tiene que ser un string de mímimo 8 caracteres.
    check("password")
        .exists().withMessage("La contraseña es obligatoria")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isString().withMessage("La contraseña debe ser un string")
        .isLength({ min: 8 }).withMessage("La contraseña es muy corta"),

    // Middleware para manejar los resultados de la validación
    (req, res, next) => {
        return validateResults(req, res, next);
    },
    
];

module.exports = { validatorCreateItem };

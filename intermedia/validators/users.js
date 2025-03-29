const { check } = require("express-validator");
const User = require("../models/users");
const validateResults = require("../utils/handleValidator.js");

const validatorCreateItem = [
    check("name")
        .exists().withMessage("El nombre de usuario es obligatorio")
        .notEmpty().withMessage("El nombre del usuario no puede estar vacío")
        .isString().withMessage("El nombre del usuario debe ser un string")
        .isLength({ min: 5 }).withMessage("El nombre del usuario es muy corto")
        .isLength({ max: 90 }).withMessage("El nombre del usuario es muy largo"),

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

// --- ARCHIVO DE VALIDACIÓN DE USUARIOS (GESTIÓN DE LOS ERRORES HTTP) --- //

const { validationResult } = require("express-validator"); // Librería validadora.
const { handleHttpError } = require("../../utils/handleError");  // Archivo para manejar errores.

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const emailConflict = errors.array().find(err => err.msg === "El email ya está registrado");

        // En el caso de que el email ya exista al crear, develve un error 409.
        if (emailConflict) {
            return handleHttpError(res, "El email ya está registrado", 409);
        }

        return handleHttpError(res, errors.array(), 400);
    }

    next();
};

module.exports = validationMiddleware;

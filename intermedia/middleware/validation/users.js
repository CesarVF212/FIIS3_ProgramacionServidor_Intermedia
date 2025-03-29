const { validationResult } = require("express-validator");
const { handleHttpError } = require("../../utils/handleError"); 

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const emailConflict = errors.array().find(err => err.msg === "El email ya está registrado");

        if (emailConflict) {
            return handleHttpError(res, "El email ya está registrado", 409);
        }

        return handleHttpError(res, errors.array(), 400);
    }

    next();
};

module.exports = validationMiddleware;

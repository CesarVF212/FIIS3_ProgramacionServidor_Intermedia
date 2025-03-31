const { handleHttpError } = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");
const User = require("../models/users");

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return handleHttpError(res, "NOT_TOKEN", 401);
        }

        // Extraer el token desde el header
        const token = req.headers.authorization.split(" ").pop();
        const dataToken = verifyToken(token); // Verificar token

        if (!dataToken || !dataToken._id) {
            return handleHttpError(res, "ERROR_ID_TOKEN", 401);
        }

        // Buscar al usuario en la base de datos y adjuntarlo a la request
        const user = await User.findById(dataToken._id);
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        req.user = user;
        next();
    } catch (err) {
        return handleHttpError(res, "NOT_SESSION", 401);
    }
};

module.exports = authMiddleware;
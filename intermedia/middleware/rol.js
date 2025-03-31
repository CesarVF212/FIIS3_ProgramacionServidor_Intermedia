const { handleHttpError } = require("../utils/handleError");

const checkRol = (roles) => (req, res, next) => {
    try {
        const { user } = req;
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        const userRol = user.role;
        if (!roles.includes(userRol)) {
            return handleHttpError(res, "NOT_ALLOWED", 403);
        }

        next();
    } catch (err) {
        return handleHttpError(res, "ERROR_PERMISSIONS", 403);
    }
};

module.exports = checkRol;

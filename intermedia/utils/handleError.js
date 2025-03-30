// --- GESTIÓN DE LOS ERRORES HTTP --- //

const handleHttpError = (res, message, code = 403) => {
    res.status(code).send(message)
}

module.exports = { handleHttpError }
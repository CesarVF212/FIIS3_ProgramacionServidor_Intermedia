const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro"; // Usa variables de entorno

// Función para generar un token JWT
const tokenSign = (user) => {
    return jwt.sign(
        { _id: user._id, role: user.role }, // Datos dentro del token
        JWT_SECRET,
        { expiresIn: "2h" } // Tiempo de expiración
    );
};

// Función para verificar un token JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { tokenSign, verifyToken };

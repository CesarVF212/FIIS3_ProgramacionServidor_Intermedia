const express = require('express');
const router = express.Router();
const {
    getItem, getItems, updateItem, createUser, deleteItem, loginUser, verifyEmail
} = require('../controllers/users.js');

const { validatorCreateItem } = require("../validators/users.js");
const validationMiddleware = require("../middleware/validation/users.js");
const authMiddleware = require("../middleware/session");
const checkRol = require("../middleware/rol");

// Rutas públicas
router.post("/register", validatorCreateItem, validationMiddleware, createUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);

// Rutas protegidas (requieren autenticación con JWT)
router.get('/', authMiddleware, getItems);
router.get('/:email', authMiddleware, getItem);
router.put('/:email', authMiddleware, updateItem);
router.delete('/:email', authMiddleware, checkRol(["admin"]), deleteItem);


// No he podido implementar esta parte que la tengo en el auth.
// const { createUser, verifyEmail, loginUser, updateUser, uploadLogo } = require('../controllers/auth');

// // Rutas
// router.post('/register', validatorCreateItem, createUser);
// router.post('/verify-email', verifyEmail);
// router.post('/login', loginUser);
// router.put('/onboarding', updateUser);
// router.patch('/logo', uploadLogo);

// module.exports = router;


module.exports = router;
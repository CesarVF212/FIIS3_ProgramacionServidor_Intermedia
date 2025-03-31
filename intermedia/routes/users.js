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

module.exports = router;
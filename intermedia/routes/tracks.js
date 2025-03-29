const express = require("express");
const router = express.Router();
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/tracks");
const { validatorCreateItem } = require("../validators/tracks");

router.get("/", getItems);

router.get("/:id", getItem);

// Ruta POST para crear un track, incluye la validación del email
router.post("/", validatorCreateItem, createItem);

router.put("/:id", validatorCreateItem, updateItem);

router.delete("/:id", deleteItem);

module.exports = router;

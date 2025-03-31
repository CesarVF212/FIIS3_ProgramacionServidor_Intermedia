const express = require('express');
const router = express.Router();
const {getItem, getItems, updateItem, createUser, deleteItem, loginUser, verifyEmail } = require ('../controllers/users.js')
const { validatorCreateItem } = require("../validators/users.js");
const validationMiddleware = require("../middleware/validation/users.js");

router.get('/', getItems);
router.get('/:email', getItem);
router.post('/', validatorCreateItem, validationMiddleware, createUser);
router.put('/:email', (req, res) => {
    console.log(req.params);
    updateItem(req, res);
});
router.delete('/:email', deleteItem);

router.post("/login", loginUser);

router.post("/verify-email", verifyEmail);

module.exports = router;

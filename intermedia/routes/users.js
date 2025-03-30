const express = require('express');
const router = express.Router();
const {getItem, getItems, updateItem, createItem, deleteItem} = require ('../controllers/users.js')
const { validatorCreateItem } = require("../validators/users.js");
const validationMiddleware = require("../middleware/validation/users.js");
const { loginUser } = require('../controllers/users.js');

router.get('/', getItems);
router.get('/:email', getItem);
router.post('/', validatorCreateItem, validationMiddleware, createItem);
router.put('/:email', (req, res) => {
    console.log(req.params);
    updateItem(req, res);
});
router.delete('/:email', deleteItem);

router.post("/login", loginUser);

module.exports = router;

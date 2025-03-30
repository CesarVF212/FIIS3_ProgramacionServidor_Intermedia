// --- DEFINE EL CONTROLADOR PARA MANEJAR LAS OPERACIONES SOBRE LA BASE DE DATOS DE LAS CANCIONES ---

const tracksModel = require('../models/tracks'); // Modelo de las canciones.
const { handleHttpError } = require('../utils/handleError'); // Arhcivo para manejar errores.
const { matchedData } = require('express-validator'); // Librería validadora.


// Obtiene todos los elementos de la base de datos.
const getItems = async (req, res) => {
    try {
        const user = req.user;
        const data = await tracksModel.find({});
        res.json({ data, user });
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEMS');
    }
};

// Obtiene un elemento de la base de datos.
const getItem = async (req, res) => {
    try {
        const { id } = matchedData(req); // Extrae solo el id validado
        const data = await tracksModel.findById(id);
        
        if (!data) {
            return handleHttpError(res, "ITEM_NOT_FOUND", 404);
        }

        res.json(data);
    } catch (err) {
        handleHttpError(res, "ERROR_GET_ITEM");
    }
};

// Crea un nuevo elemento en la base de datos.
const createItem = async (req, res) => {
    try {
        const body = matchedData(req); // Filtra los datos validados
        const data = await tracksModel.create(body);
        res.status(201).json(data);
    } catch (err) {
        handleHttpError(res, 'ERROR_CREATE_ITEM');
    }
};

// Actualiza un elemento de la base de datos.
const updateItem = async (req, res) => {
    try {
        const { id, ...body } = matchedData(req); // Extrae ID y el resto de datos
        const data = await tracksModel.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!data) {
            return handleHttpError(res, "ITEM_NOT_FOUND", 404);
        }

        res.json(data);
    } catch (err) {
        handleHttpError(res, 'ERROR_UPDATE_ITEM');
    }
};

// Borrado físico de un elemento.
const deleteItem = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const data = await tracksModel.findByIdAndDelete(id); // Borrado físico

        if (!data) {
            return handleHttpError(res, "ITEM_NOT_FOUND", 404);
        }

        res.json({ message: "Track eliminado", data });
    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_ITEM');
    }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };

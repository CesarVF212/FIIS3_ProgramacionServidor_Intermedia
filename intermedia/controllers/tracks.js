const tracksModel = require('../models/tracks');
const { handleHttpError } = require('../utils/handleError');
const { matchedData } = require('express-validator');

/**
 * Obtener lista de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    try {
        const user = req.user; // Para trazabilidad
        const data = await tracksModel.find({});
        res.json({ data, user });
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEMS');
    }
};

/**
 * Obtener un detalle por ID
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Crear un nuevo track
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    try {
        const body = matchedData(req); // Filtra los datos validados
        const data = await tracksModel.create(body);
        res.status(201).json(data);
    } catch (err) {
        handleHttpError(res, 'ERROR_CREATE_ITEM');
    }
};

/**
 * Actualizar un track por ID
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Eliminar un track por ID (Borrado físico o lógico)
 * @param {*} req 
 * @param {*} res 
 */
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

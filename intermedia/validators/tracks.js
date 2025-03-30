// --- DEFINE EL VALIDADOR DE LAS CANCIONES ---

const { check } = require("express-validator"); // Librería para validar datos en Express.
const validateResults = require("../utils/handleValidator"); // Controlador de los validadores.

const validatorCreateItem = [

    // El nombre tiene es oblgatorio, no puede estar vacío y tiene que tener una longitud mínima de 5 caracteres y máxima de 90.
    check("name")
        .exists().withMessage("El nombre es obligatorio")
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .isLength({ min: 5 }).withMessage("El nombre de la canción es muy corto")
        .isLength({ max: 90 }).withMessage("El nombre de la canción es muy largo"),

    // El album es obligatorio y no puede estar vacío.
    check("album")
        .exists().withMessage("El álbum es obligatorio")
        .notEmpty().withMessage("El álbum no puede estar vacío"),

    // La portada es obligatoria, no puede estar vacía, y tiene que ser un archivo de imágen válido.
    check("cover")
        .exists().withMessage("La portada es obligatoria")
        .notEmpty().withMessage("La portada no puede estar vacía")
        .custom((value) => {
            const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]; // Estas son las extensiones válidas para las imágenes.
            const url = new URL(value);
            const extension = url.pathname.split(".").pop().toLowerCase();
    
            if (!validExtensions.includes(`.${extension}`)) {
                throw new Error("La URL debe ser una imagen válida (JPG, PNG, GIF, WEBP)");
            }
    
            return true;
        }),

    // El artista no puede estar vacío y es obligatorio.
    check("artist")
        .exists().withMessage("El artista es obligatorio")
        .notEmpty().withMessage("El artista no puede estar vacío"),

    // La duración no puede estar vacía, es obligatoria y tiene que ser un número.
    check("duration")
        .exists().withMessage("La duración es obligatoria")
        .notEmpty().withMessage("La duración no puede estar vacía")
        .isNumeric().withMessage("La duración debe ser un número"),

    (req, res, next) => {
        validateResults(req, res, next);
    },

];

module.exports = { validatorCreateItem };

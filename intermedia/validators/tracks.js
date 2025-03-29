const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
    check("name")
        .exists().withMessage("El nombre es obligatorio")
        .notEmpty().withMessage("El nombre no puede estar vacío")
        .isLength({ min: 5 }).withMessage("El nombre de la canción es muy corto")
        .isLength({ max: 90 }).withMessage("El nombre de la canción es muy largo"),

    check("album")
        .exists().withMessage("El álbum es obligatorio")
        .notEmpty().withMessage("El álbum no puede estar vacío"),

        check("cover")
        .exists().withMessage("La portada es obligatoria")
        .notEmpty().withMessage("La portada no puede estar vacía")
        .custom((value) => {
            const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
            const url = new URL(value);
            const extension = url.pathname.split(".").pop().toLowerCase();
    
            if (!validExtensions.includes(`.${extension}`)) {
                throw new Error("La URL debe ser una imagen válida (JPG, PNG, GIF, WEBP)");
            }
    
            return true;
        }),

    check("artist")
        .exists().withMessage("El artista es obligatorio")
        .notEmpty().withMessage("El artista no puede estar vacío"),

    check("duration")
        .exists().withMessage("La duración es obligatoria")
        .notEmpty().withMessage("La duración no puede estar vacía")
        .isNumeric().withMessage("La duración debe ser un número"),

    (req, res, next) => {
        validateResults(req, res, next);
    },
];

module.exports = { validatorCreateItem };

const {validatorCreateItem} = require("../validators/users");
const customHeader = require("middleware/customHeader");

// Esto actua como un middleware que se ejecuta antes de la función del controlador.
// Se puede usar para validar los datos de entrada, autenticar al usuario, etc.
// En este caso, se usa para validar los datos de entrada antes de crear un nuevo elemento.

router.post("users/", validatorCreateItem, customHeader, createItem);
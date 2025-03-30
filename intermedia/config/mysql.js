// --- CONFIGURACIÓN DE LA CONEXIÓN CON LA BASE DE DATOS SQL ---

const {Sequelize} = require("sequelize"); // Utilizamos la librería de Sequelize para abstraernos de la conexión a la base de datos SQL.

const database = process.env.MYSQL_DATABASE
const username = process.env.MYSQL_USER
const password = process.env.MYSQL_PASSWORD 
const host = process.env.MYSQL_HOST

const sequelize = new Sequelize(database, username, password, {
    host, 
    dialect:"mariadb" // Ya que es mi gestor de bases de datos.
})

const dbConnectMysql = async() => {
    
    // Caso de conexión aceptada.
    try {
        await sequelize.authenticate()
        console.log("config/mysql.js: \t Conexion MYSQL correcta.");
    }

    // Caso de conexión rechazada.
    catch(err){
        console.log("config/mysql.js: \t Conexion MYSQL rechazada. ", error);
    }

}

module.exports = { sequelize, dbConnectMysql }
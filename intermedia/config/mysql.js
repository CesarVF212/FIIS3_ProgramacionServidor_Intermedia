const {Sequelize} = require("sequelize");

const database = process.env.MYSQL_DATABASE
const username = process.env.MYSQL_USER
const password = process.env.MYSQL_PASSWORD 
const host = process.env.MYSQL_HOST

const sequelize = new Sequelize(database, username, password, {
    host, 
    dialect:"mariadb"
})

const dbConnectMysql = async() => {
    
    try {
        await sequelize.authenticate()
        console.log("config/mysql.js: \t Conexion MYSQL correcta.");
    }

    catch(err){
        console.log("config/mysql.js: \t Conexion MYSQL rechazada. ", error);
    }

}

module.exports = { sequelize, dbConnectMysql }
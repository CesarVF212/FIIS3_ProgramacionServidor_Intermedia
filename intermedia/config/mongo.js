// --- CONFIGURACIÓN DE LA CONEXIÓN CON LA BASA DE DATOS MONGODB ---

const mongoose = require('mongoose')

const dbConnect = () => {
    const db_uri = process.env.MONGO_URI
    mongoose.set('strictQuery', false)
    mongoose.connect(db_uri)
}

mongoose.connection.on('connected', () => console.log("Conectado a la BD"))

mongoose.connection.on('error', (e) => console.log (e.message))

module.exports = dbConnect
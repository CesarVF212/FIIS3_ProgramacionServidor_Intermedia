const express = require('express')
const cors = require('cors')
const morganBody = require("morgan-body")

require ('dotenv').config()

const loggerStream = require("./utils/handleLogger")

const routers = require('./routes')
const dbConnect = require('./config/mongo.js')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', routers)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)
})

morganBody(app, {

    noColors: true, // Limpiamos el String de datos lo máximo posible antes de mandarlo a Slack
    skip: function(req, res) { // Solo enviamos errores (4XX de cliente y 5XX de servidor)
        return res.statusCode < 400
    },
    stream: loggerStream

})

dbConnect()
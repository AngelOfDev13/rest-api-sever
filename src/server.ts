import express from "express";
import router from "./router";
import db from "./config/db";
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import morgan from 'morgan'

//conectar a base de datos 
export const connectDb = async () => {
    try {
        await db.authenticate()
        db.sync()
        // console.log( colors.blue.bold('Conexion exitosa  a la base de datos'))
    } catch(error) {
        console.log(error)
        console.log( colors.red.bold('hubo un error al conectar a la base de datos'))
    }
}

connectDb()
// instancia de express
const app = express()
// habilitando conexiones mediante cors
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
app.use(cors(corsOptions))

// leer datos del formulario
app.use(express.json())
app.use(morgan('dev'))

const port = process.env.PORT || 5000

app.use('/api/products', router)

// Docs 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export {
    app,
    port
}

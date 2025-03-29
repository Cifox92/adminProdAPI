import express from 'express'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import router from './router'
import db from './config/db'

//Conectar a la base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()

        //console.log(colors.blue.bold('Connection to the database has been established successfully.'))
    } catch(e) {
        console.error(colors.red.bold('Error connecting to the database'))
    }
}

connectDB()

//Express instance
const server = express()

//CORS
const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

//Read body
server.use(express.json())

//Morgan
server.use(morgan('dev'))

//Routes
server.use('/api/products', router)

//Documentation of the API
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server
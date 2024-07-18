import { exit } from 'node:process'
import db from '../config/db'
import colors, { red } from 'colors'

const clearDb = async () => {
    try {
        await db.sync({ force: true })
        console.log( colors.blue.bold('Datos Eliminados Correctamente'))
        exit(0)
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === '--clear'){
    clearDb()
}
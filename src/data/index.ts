import { exit } from 'node:process'
import db from '../config/db'

const clearDB = async () => {
    try {
        await db.sync({force: true})
        console.log('DB cleared')
        exit(0)
    } catch(e) {
        console.log('Error clearing the DB: ', e)
        exit(1)
    }
}

if(process.argv[2] === '--clear') {
    clearDB()
}

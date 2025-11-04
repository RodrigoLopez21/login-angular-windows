import dotenv from 'dotenv'
import Server from './models/server'

// CONFIGURACION DEL DOTENV
dotenv.config() 
const server = new Server()
server.initialize().catch(error => {
    console.error('Failed to start server:', error)
    process.exit(1)
})


import express, {Application} from 'express'
import cors from 'cors'
import { testConnection } from '../database/connection'
import routesCategoty from '../routes/category'
import routesProduct from '../routes/product'
import routesRole from '../routes/role'
import routesUser from '../routes/user'
import { Category } from './category'
import { Product } from './product'
import { Role } from './role'
import { User } from './user'

class Server {

    private app: Application
    private port: string
    
    constructor(){
        this.app = express()
        this.port = process.env.PORT || '3001'

        this.midlewares();
        this.router();
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("La aplicación se esta corriendo exitosamente en el puerto => "+ this.port)           
        })
    }

    router(){
        this.app.use(routesCategoty);
        this.app.use(routesProduct);
        this.app.use(routesRole);
        this.app.use(routesUser);
    }

    midlewares(){
        //Parseo BOdy
        this.app.use(express.json())
        
        //
        this.app.use(cors())
    }

    async initialize() {
        try {
            // 1. Sincronizar modelos y probar conexión a la DB
            await this.DBconnetc();
            
            // 2. Iniciar el servidor solo si la conexión a la DB es exitosa
            this.listen();
        } catch (error) {
            console.error('Fallo al inicializar el servidor:', error);
            process.exit(1);
        }
    }

    async DBconnetc(){
        try {

            // await Product.sync({force: true}); // Clean date of table
            await Category.sync(); 
            await Product.sync(); 
            // await User.sync({alter: true}); // Update atribute of table
            await Role.sync(); 
            await User.sync(); 
            await testConnection(); // Reutilizamos la función para mostrar el mensaje de éxito
        
        } catch (error) {
            console.error("Error en la conexión a la base de datos => ", error);
            throw error; // Lanzamos el error para que initialize() lo capture
            
        }
    }
}


export default Server
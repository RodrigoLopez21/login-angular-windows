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
        
    }

    async initialize() {
        try {
            // Test database connection
            await testConnection();
            
            // Start server only if DB connection is successful
            this.listen();
        } catch (error) {
            console.error('Failed to initialize server:', error);
            process.exit(1);
        }
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

    async DBconnetc(){
        try {

            // await Product.sync({force: true}); // Clean date of table
            await Category.sync(); 
            await Product.sync(); 
            // await User.sync({alter: true}); // Update atribute of table
            await Role.sync(); 
            await User.sync(); 
            console.log("Conexion de DB exitoso");
        
        } catch (error) {
            console.log("Conexion de DB errorena => "+error);
            
        }
    }
}


export default Server
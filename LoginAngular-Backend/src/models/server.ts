import express, {Application} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import sequelize, { testConnection } from '../database/connection'
import routesCategory from '../routes/category'
import routesProduct from '../routes/product'
import routesRole from '../routes/role'
import routesUser from '../routes/user'
import routesLoginHistory from '../routes/login_history'

class Server {

    private app: Application
    private port: string
    
    constructor(){
        this.app = express()
        this.port = process.env.PORT || '3001'

        this.middlewares();
        this.router();
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("La aplicación se esta corriendo exitosamente en el puerto => "+ this.port)           
        })
    }

    router(){
        this.app.use(routesCategory);
        this.app.use(routesProduct);
        this.app.use(routesRole);
        this.app.use(routesUser);
        this.app.use(routesLoginHistory);
    }

    middlewares() {
        // Parseo del body
        this.app.use(express.json());

        // CORS
        this.app.use(cors());

        // 🔐 Cabeceras de Seguridad con Helmet
        this.app.use(helmet());
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
            // Sincronizamos TODOS los modelos de una sola vez.
            // En producción, es mejor usar migraciones en lugar de sync().
            await sequelize.sync();
            console.log('Todos los modelos fueron sincronizados exitosamente.');
            await testConnection(); // Reutilizamos la función para mostrar el mensaje de éxito
        
        } catch (error) {
            console.error("Error en la conexión a la base de datos => ", error);
            throw error; // Lanzamos el error para que initialize() lo capture
            
        }
    }
}


export default Server
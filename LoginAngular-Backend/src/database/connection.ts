import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'test', 
    process.env.DB_USER || 'root', 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql', // ¡Esta es la corrección clave!
        port: Number(process.env.DB_PORT) || 3306,
        logging: false, // Desactiva los logs de SQL en la consola para mayor claridad
    }
);

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        // Es una buena práctica terminar el proceso si la DB no está disponible
        process.exit(1);
    }
};

export default sequelize;
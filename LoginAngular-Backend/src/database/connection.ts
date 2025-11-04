import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'defaultdb',
    process.env.DB_USER || 'defaultuser',
    process.env.DB_PASSWORD || 'defaultpass',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
        logging: false, // set to console.log to see SQL queries
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test connection function
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

export default sequelize;
import dotenv from 'dotenv'
dotenv.config()

export default {
  APP: process.env.APP ?? 'development',
  PORT: process.env.PORT ?? '3055',

  DB_DIALECT: process.env.DB_DIALECT ?? 'mongo',
  DB_HOST: process.env.DB_HOST ?? 'mongodb://localhost:27017/db',
  DB_NAME: process.env.DB_NAME ?? 'database',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'db-password',
  DB_PORT: process.env.DB_PORT ?? '27017',
  DB_USER: process.env.DB_USER ?? 'root',

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION ?? 'jwt_please_change',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION ?? '1h',
  JWT_SECRET: process.env.JWT_SECRET ?? 'SECRET-KEY-997',
  SALT_ROUNDS: process.env.SALT_ROUNDS ?? 10,

  BOOKS_API_KEY: process.env.BOOKS_API_KEY ?? 'default',
  BOOKS_UID: process.env.BOOKS_UID ?? 12345
}

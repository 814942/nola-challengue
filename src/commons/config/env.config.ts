import { ConfigProps } from '../interfaces/env-config.interface';

export const config = (): ConfigProps => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  database: {
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
    username: process.env.DATABASE_USERNAME as string,
    password: process.env.DATABASE_PASSWORD as string,
    name: process.env.DATABASE_NAME as string,
  },
  whitelist: process.env.CLIENT_URL_CONNECTION as string,
  tokens: {
    access: process.env.JWT_ACCESS_SECRET as string,
    refresh: process.env.JWT_REFRESH_SECRET as string,
  }
});

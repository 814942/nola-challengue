import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';

import { config } from './commons/config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true,
        retryAttempts: 10,
        retryDelay: 3000,
        connectTimeout: 60000,
        extra: {
          connectionLimit: 10,
        },
      }),
    }),
    AuthModule,
    LoggerModule,
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { UsersModule } from "@users";
import { AuthModule } from "@auth";
import { MoviesModule } from "@movies";
import { GenreModule } from "@genre";
import { HttpExceptionFilter } from "@filters";
import { LoggerService } from "@utils";
import { YouTubeModule } from "@youtube";
import { LoggingInterceptor } from "@interceptors";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("PGHOST"),
        port: configService.get("PGPORT"),
        username: configService.get("PGUSER"),
        password: configService.get("PGPASSWORD"),
        database: configService.get("PGDATABASE"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
        logging: ["error", "warn", "info"],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MoviesModule,
    UsersModule,
    AuthModule,
    GenreModule,
    YouTubeModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 100,
          ttl: 60 * 1000,
        },
      ],
    }),
  ],
  providers: [
    LoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}

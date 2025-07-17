import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { UsersModule } from "@users";
import { AuthModule } from "@auth";
import { CoreModule } from "@core";
import { MoviesModule } from "@movies";
import { GenreModule } from "@genre";
import { HttpExceptionFilter } from "@filters";
import { LoggerService } from "@utils";
import { YouTubeModule } from "@youtube";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
        logging: ["error", "warn", "info"],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CoreModule,
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
  ],
})
export class AppModule {}

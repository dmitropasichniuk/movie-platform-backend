import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../../src/auth/auth.module";
import { UsersModule } from "../../src/users/users.module";
import { MoviesModule } from "../../src/movies/movies.module";
import { GenreModule } from "../../src/genre/genre.module";
import { YouTubeModule } from "../../src/common/youtube/youtube.module";

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
    MoviesModule,
    UsersModule,
    AuthModule,
    GenreModule,
    YouTubeModule,
  ],
})
export class TestAppModule {}

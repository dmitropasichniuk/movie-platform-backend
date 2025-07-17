import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GenreEntity } from "@genre";
import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}

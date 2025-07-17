import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MovieEntity, MoviesService } from "@movies";
import { MoviesController } from "./movies.controller";
import { YouTubeModule } from "@youtube";
@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), YouTubeModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}

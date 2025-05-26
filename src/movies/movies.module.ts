import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieEntity } from 'src/movies/entities/movies.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity])
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}

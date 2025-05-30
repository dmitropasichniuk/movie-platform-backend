import { BadRequestException, Injectable } from '@nestjs/common';
import { Movie } from './interfaces/movie.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMovieDto } from "./dto";
import { DefaultResponseDto } from "src/common/dto";
import { MovieEntity } from './entities/movies.entity';

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  
  async create(createMovieDto: CreateMovieDto): Promise<DefaultResponseDto> {
    try {
      const movie = this.movieRepository.create(createMovieDto);
      const savedMovie = await this.movieRepository.save(movie);
      
      return {
        success: true,
        status: 201,
        message: 'Movie created successfully',
        data: savedMovie
      };
    } catch (error) {
      throw new BadRequestException('Failed to create movie');
    }
  }

  async findAll(): Promise<DefaultResponseDto> {
    try {
      const movies = await this.movieRepository.find();
      
      return {
        success: true,
        status: 200,
        message: 'Movies retrieved successfully',
        data: movies
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve movies');
    }
  }

}

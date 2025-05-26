import { Body, Controller, Get, Post } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { DefaultResponseDto } from "./dto/default-response.dto";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(
    @Body() createMovieDto: CreateMovieDto
  ): Promise<DefaultResponseDto> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  async findAll(): Promise<DefaultResponseDto> {
    return this.moviesService.findAll();
  }
}

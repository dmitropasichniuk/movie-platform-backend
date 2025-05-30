import { Body, Controller, Get, Post } from "@nestjs/common";

import { MoviesService } from "./movies.service";
import { DefaultResponseDto } from "src/common/dto";
import { CreateMovieDto } from "./dto";

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

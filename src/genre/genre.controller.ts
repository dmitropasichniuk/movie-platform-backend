import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { GenreResponseDto } from "./dto";
import { GenreService } from "./genre.service";
import { DefaultResponseDto } from "@dtos";

@ApiTags("Genres")
@Controller("genres")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiOperation({
    summary: "Get a list of genres",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of genres",
    type: DefaultResponseDto<GenreResponseDto[]>,
  })
  @ApiResponse({ status: 404, description: "Genres not found" })
  async getGenres(): Promise<DefaultResponseDto<GenreResponseDto[]>> {
    const response = await this.genreService.findAll();

    return {
      message: "Genres successfully retrieved",
      data: response,
    };
  }
}

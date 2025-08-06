import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";

import {
  MovieFilterDto,
  MovieResponseDto,
  MoviesService,
  MovieTrailerResponseDto,
} from "@movies";
import { DefaultResponseDto, PaginatedResponseDto } from "@dtos";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { ApiSearchThrottle } from "@decorators";

@ApiTags("Movies")
@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({
    summary: "Get a list of movies",
    description:
      "Retrieve a list of movies with optional filters and pagination",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by movie title",
    example: "Lilo & Stitch",
  })
  @ApiQuery({
    name: "releaseYear",
    required: false,
    type: Number,
    description: "Movie release year",
    example: 2025,
  })
  @ApiQuery({
    name: "adult",
    required: false,
    type: Boolean,
    description: "Adult content (true/false)",
    example: false,
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    enum: ["title", "releaseDate", "rating", "popularity"],
    description: "Field to sort by",
    example: "title",
  })
  @ApiQuery({
    name: "order",
    required: false,
    enum: ["ASC", "DESC"],
    description: "Sort order",
    example: "ASC",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of items per page (default: 20)",
    example: 20,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Movies retrieved successfully",
    schema: {
      example: {
        message: "Movie retrieved successfully",
        data: {
          results: [
            {
              externalId: 550,
              title: "Fight Club",
              description:
                "An insomniac office worker crosses paths with a soap maker...",
              releaseDate: "1999-10-15",
              voteAverage: 8.8,
              voteCount: 26280,
              popularity: 61.416,
              adult: false,
              originalLanguage: "en",
              posterPath: "/uploads/posters/fight-club.jpg",
              backdropPath: "/uploads/backdrops/fight-club.jpg",
              genres: [
                { externalId: 18, name: "Drama" },
                { externalId: 53, name: "Thriller" },
              ],
            },
          ],
          total: 150,
          page: 1,
          limit: 20,
          totalPages: 8,
          hasNext: true,
          hasPrev: false,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid query parameters" })
  @ApiSearchThrottle(500, 1)
  async getMovies(
    @Query() filterDto: MovieFilterDto
  ): Promise<DefaultResponseDto<PaginatedResponseDto<MovieResponseDto>>> {
    const response = await this.moviesService.findWithFilters(filterDto);

    return {
      message: "Movie retrieved successfully",
      data: response,
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get movie by ID",
    description: "Retrieve detailed information about a movie by its unique ID",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Unique movie ID",
    example: 550,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Movie retrieved successfully",
    schema: {
      example: {
        message: "Movie retrieved successfully",
        data: {
          externalId: 550,
          title: "Fight Club",
          description:
            "An insomniac office worker crosses paths with a soap maker...",
          releaseDate: "1999-10-15",
          voteAverage: 8.8,
          voteCount: 26280,
          popularity: 61.416,
          adult: false,
          originalLanguage: "en",
          posterPath: "/uploads/posters/fight-club.jpg",
          backdropPath: "/uploads/backdrops/fight-club.jpg",
          genres: [
            { externalId: 18, name: "Drama" },
            { externalId: 53, name: "Thriller" },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 404, description: "Movie not found" })
  @ApiSearchThrottle(200, 1)
  async findOne(
    @Param("id") id: number
  ): Promise<DefaultResponseDto<MovieResponseDto>> {
    const movie = await this.moviesService.findOneBy(id);

    return {
      message: "Movie retrieved successfully",
      data: movie,
    };
  }

  @Get(":id/trailer")
  @ApiOperation({
    summary: "Get movie trailer by ID",
    description:
      "Returns the YouTube video ID of the movie trailer. If already saved — returns it immediately, otherwise makes a request to YouTube.",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Unique movie ID (externalId)",
    example: 550,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Trailer retrieved successfully",
    type: DefaultResponseDto<MovieTrailerResponseDto>,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 404, description: "Movie not found" })
  @ApiResponse({
    status: 500,
    description: "Failed to fetch trailer from YouTube",
  })
  @ApiSearchThrottle(200, 1)
  async getTrailer(
    @Param("id", ParseIntPipe) externalId: number
  ): Promise<DefaultResponseDto<MovieTrailerResponseDto>> {
    const trailer = await this.moviesService.getTrailer(externalId);

    return {
      message: "Trailer retrieved successfully",
      data: trailer,
    };
  }
}

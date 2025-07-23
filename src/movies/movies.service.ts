import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToClass, plainToInstance } from "class-transformer";

import {
  MovieEntity,
  MovieFilterDto,
  MovieResponseDto,
  MovieTrailerResponseDto,
} from "@movies";
import { PaginatedResponseDto } from "@dtos";
import { YouTubeService } from "@youtube";
import { LoggerService } from "@utils";

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly youtubeService: YouTubeService,
  ) {}

  async findWithFilters(
    dto: MovieFilterDto,
  ): Promise<PaginatedResponseDto<MovieResponseDto>> {
    const query = this.movieRepository.createQueryBuilder("movie");

    if (dto.search) {
      query.andWhere("LOWER(movie.title) LIKE LOWER(:search)", {
        search: `%${dto.search}%`,
      });
    }

    query.leftJoinAndSelect("movie.genres", "genre");
    if (dto.genreIds?.length) {
      query.andWhere("genre.externalId IN (:...genreIds)", {
        genreIds: dto.genreIds,
      });
    }

    if (dto.releaseYear) {
      query.andWhere("EXTRACT(YEAR FROM movie.releaseDate) = :year", {
        year: dto.releaseYear,
      });
    }

    if (dto.adult !== undefined) {
      query.andWhere("movie.adult = :adult", { adult: dto.adult });
    }

    if (dto.sortBy) {
      query.orderBy(
        `movie.${dto.sortBy}`,
        dto.order === "ASC" ? "ASC" : "DESC",
      );
    }

    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const offset = (page - 1) * limit;

    query.skip(offset).take(limit);

    const [movies, total] = await query.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      results: plainToInstance(MovieResponseDto, movies, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async findOneBy(id: number): Promise<MovieResponseDto> {
    const movie: MovieEntity = await this.movieRepository.findOne({
      where: { externalId: id },
      relations: ["genres"],
    });

    if (!movie) {
      throw new NotFoundException("Movie not found");
    }

    return plainToClass(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  async getMovieEntityByExternalId(externalId: number): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOneBy({ externalId });
    if (!movie) throw new NotFoundException("Movie not found");
    return movie;
  }

  async getTrailer(externalId: number): Promise<MovieTrailerResponseDto> {
    const movie = await this.movieRepository.findOne({
      where: { externalId },
    });
    if (!movie) throw new NotFoundException("Movie not found");

    if (movie.videoId) {
      return { videoId: movie.videoId };
    }

    try {
      const videoId = await this.youtubeService.fetchTrailer(movie.title);
      if (videoId) {
        movie.videoId = videoId;
        await this.movieRepository.save(movie);
        LoggerService.log(
          MoviesService.name,
          `Saved trailer for movie: ${movie.title}`,
        );
      }
      return { videoId };
    } catch (error) {
      LoggerService.error(MoviesService.name, `Error: ${error?.message}`);
      throw new InternalServerErrorException("Failed to retrieve trailer");
    }
  }
}

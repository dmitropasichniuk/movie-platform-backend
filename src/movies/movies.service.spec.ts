import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import {
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";

import { MovieEntity } from "./entities";
import { MoviesService } from "./movies.service";
import { MovieFilterDto } from "./dto";
import { YouTubeService } from "@youtube";

let service: MoviesService;
let youtubeService: YouTubeService;
let movieRepo: jest.Mocked<Repository<MovieEntity>>;
let qb: jest.Mocked<SelectQueryBuilder<MovieEntity>>;

const movieExternalId = 550;
const movieEntityFactory = (
  overrides: Partial<MovieEntity> = {},
): MovieEntity => {
  return {
    externalId: 550,
    title: "Fight Club",
    description:
      "An insomniac office worker crosses paths with a soap maker...",
    releaseDate: "1999-10-15",
    voteAverage: 8.8,
    voteCount: 26280,
    videoId: "abc123",
    popularity: 61.416,
    adult: false,
    originalLanguage: "en",
    posterPath: "/uploads/posters/fight-club.jpg",
    backdropPath: "/uploads/backdrops/fight-club.jpg",
    genres: null,
    ...overrides,
  } as MovieEntity;
};

const movieFilterDtoFactory = (
  overrides: Partial<MovieFilterDto> = {},
): MovieFilterDto => {
  return {
    page: 1,
    limit: 20,
    ...overrides,
  };
};

const mockMoviesArray = [movieEntityFactory()];

describe("MoviesService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: YouTubeService,
          useValue: {
            fetchTrailer: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MoviesService);
    youtubeService = module.get(YouTubeService);
    movieRepo = module.get(getRepositoryToken(MovieEntity));

    qb = {
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    } as any;

    (movieRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);
  });

  describe("findWithFilters", () => {
    it("should return paginated movies with filters", async () => {
      qb.getManyAndCount.mockResolvedValueOnce([mockMoviesArray, 10]);

      const filterDto = movieFilterDtoFactory({
        page: 1,
        limit: 2,
        search: "Fight",
        genreIds: [1],
        releaseYear: null,
        adult: false,
        sortBy: "title",
        order: "ASC",
      });

      const result = await service.findWithFilters(filterDto);

      expect(movieRepo.createQueryBuilder).toHaveBeenCalledWith("movie");
      expect(qb.andWhere).toHaveBeenCalled();
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        "movie.genres",
        "genre",
      );
      expect(qb.orderBy).toHaveBeenCalledWith("movie.title", "ASC");
      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(2);
      expect(qb.getManyAndCount).toHaveBeenCalled();

      expect(result).toEqual({
        results: mockMoviesArray,
        total: 10,
        page: 1,
        limit: 2,
        totalPages: 5,
        hasNext: true,
        hasPrev: false,
      });
    });

    it("should apply default pagination if not provided", async () => {
      qb.getManyAndCount.mockResolvedValueOnce([mockMoviesArray, 2]);

      const filterDto = movieFilterDtoFactory();
      const result = await service.findWithFilters(filterDto);

      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(20);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it("should return empty results", async () => {
      qb.getManyAndCount.mockResolvedValueOnce([[], 0]);

      const filterDto = movieFilterDtoFactory();
      const result = await service.findWithFilters(filterDto);

      expect(result.results).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(false);
    });
  });

  describe("findOneBy", () => {
    it("should return a movie by externalId", async () => {
      movieRepo.findOne = jest.fn().mockResolvedValue(movieEntityFactory());
      const result = await service.findOneBy(movieExternalId);

      expect(movieRepo.findOne).toHaveBeenCalledWith({
        where: { externalId: movieExternalId },
        relations: ["genres"],
      });

      expect(result).toEqual(movieEntityFactory());
    });

    it("should throw NotFoundException if movie not found", async () => {
      movieRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOneBy(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("getMovieEntityByExternalId", () => {
    it("should return movie entity by externalId", async () => {
      movieRepo.findOneBy = jest.fn().mockResolvedValue(movieEntityFactory());
      const result = await service.getMovieEntityByExternalId(movieExternalId);

      expect(movieRepo.findOneBy).toHaveBeenCalledWith({
        externalId: movieExternalId,
      });
      expect(result).toEqual(movieEntityFactory());
    });

    it("should throw NotFoundException if movie not found", async () => {
      movieRepo.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.getMovieEntityByExternalId(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getTrailer", () => {
    it("should return trailer if videoId already exists", async () => {
      movieRepo.findOne = jest.fn().mockResolvedValue(movieEntityFactory());

      const result = await service.getTrailer(movieExternalId);

      expect(movieRepo.findOne).toHaveBeenCalledWith({
        where: { externalId: movieExternalId },
      });
      expect(result).toEqual({ videoId: "abc123" });
    });

    it("should fetch trailer, save movie and return videoId if not present", async () => {
      const movieEntityWithoutVideoId = movieEntityFactory({
        videoId: undefined,
      });
      movieRepo.findOne = jest
        .fn()
        .mockResolvedValue(movieEntityWithoutVideoId);
      movieRepo.save = jest.fn().mockResolvedValue({
        ...movieEntityWithoutVideoId,
        videoId: "fetched123",
      });
      const fetchSpy = jest
        .spyOn(youtubeService, "fetchTrailer")
        .mockResolvedValue("fetched123");

      const result = await service.getTrailer(1);

      expect(fetchSpy).toHaveBeenCalledWith("Fight Club");
      expect(movieRepo.save).toHaveBeenCalledWith({
        ...movieEntityWithoutVideoId,
        videoId: "fetched123",
      });
      expect(result).toEqual({ videoId: "fetched123" });
    });

    it("should throw if movie not found", async () => {
      movieRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getTrailer(999)).rejects.toThrow(NotFoundException);
    });

    it("should throw InternalServerErrorException if YouTube fails", async () => {
      const movieEntityWithoutVideoId = movieEntityFactory({
        videoId: undefined,
      });
      movieRepo.findOne = jest
        .fn()
        .mockResolvedValue(movieEntityWithoutVideoId);
      jest
        .spyOn(youtubeService, "fetchTrailer")
        .mockRejectedValue(new Error("Failed to retrieve trailer"));

      await expect(service.getTrailer(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";

import { MovieEntity } from "./entities";
import { MoviesService } from "./movies.service";
import { MovieFilterDto } from "./dto";

let service: MoviesService;
let movieRepo: jest.Mocked<Repository<MovieEntity>>;
let qb: jest.Mocked<SelectQueryBuilder<MovieEntity>>;

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
      ],
    }).compile();

    service = module.get(MoviesService);
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
    const mockMovies = [
      { id: 1, title: "Movie 1" },
      { id: 2, title: "Movie 2" },
    ] as MovieEntity[];

    it("should return paginated movies with filters", async () => {
      qb.getManyAndCount.mockResolvedValueOnce([mockMovies, 10]);

      const dto: MovieFilterDto = {
        search: "Movie",
        genreIds: [1],
        releaseYear: 2024,
        adult: false,
        sortBy: "title",
        order: "ASC",
        page: 1,
        limit: 2,
      };

      const result = await service.findWithFilters(dto);

      expect(movieRepo.createQueryBuilder).toHaveBeenCalledWith("movie");
      expect(qb.andWhere).toHaveBeenCalled();
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        "movie.genres",
        "genre"
      );
      expect(qb.orderBy).toHaveBeenCalledWith("movie.title", "ASC");
      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(2);
      expect(qb.getManyAndCount).toHaveBeenCalled();

      expect(result).toEqual({
        results: mockMovies,
        total: 10,
        page: 1,
        limit: 2,
        totalPages: 5,
        hasNext: true,
        hasPrev: false,
      });
    });

    it("should apply default pagination if not provided", async () => {
      qb.getManyAndCount.mockResolvedValueOnce([mockMovies, 2]);

      const dto: MovieFilterDto = { page: 1, limit: 20 };

      const result = await service.findWithFilters(dto);

      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(20);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it("should return empty results", async () => {
      qb.getManyAndCount.mockResolvedValueOnce([[], 0]);

      const dto: MovieFilterDto = { page: 1, limit: 20 };

      const result = await service.findWithFilters(dto);

      expect(result.results).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(false);
    });
  });
  // далі буде:
  // describe("findOneById", () => { ... });
  // describe("getMovieEntityByExternalId", () => { ... });
  // describe("getTrailer", () => { ... });
});

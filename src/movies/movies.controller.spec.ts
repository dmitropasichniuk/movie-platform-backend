import { Test } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './interfaces/movie.interface';

describe('CatsController', () => {
  let catsController: MoviesController;
  let catsService: MoviesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    catsService = moduleRef.get<MoviesService>(MoviesService);
    catsController = moduleRef.get<MoviesController>(MoviesController);
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [
        {
          id: 1,
          title: "Inception",
          description: "A skilled thief leads a team into dreams to steal secrets.",
          releaseDate: "2010-07-16",
          durationMinutes: 148,
          genre: ["Action", "Sci-Fi", "Thriller"],
          director: "Christopher Nolan",
          cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
          rating: 8.8,
          posterUrl: "https://example.com/inception.jpg",
          trailerUrl: "https://youtube.com/inception-trailer"
        },
      ];
      // @ts-ignore
      catsService.movies = movies;

      expect(await catsController.findAll()).toBe(movies);
    });
  });

  describe('create', () => {
    it('should add a new movie', async () => {
      const movie: Movie = {
        id: 1,
        title: "Inception",
        description: "A skilled thief leads a team into dreams to steal secrets.",
        releaseDate: "2010-07-16",
        durationMinutes: 148,
        genre: ["Action", "Sci-Fi", "Thriller"],
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        rating: 8.8,
        posterUrl: "https://example.com/inception.jpg",
        trailerUrl: "https://youtube.com/inception-trailer"
      };
      const expectedCatArray = [movie];

      // @ts-ignore
      expect(catsService.movies).toStrictEqual([]);

      await catsController.create(movie);

      // @ts-ignore
      expect(catsService.movies).toStrictEqual(expectedCatArray);
    });
  });
});

import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

describe('CatsService', () => {
  let catsService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    catsService = moduleRef.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = [
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
      //@ts-ignore
      catsService.movies = result;

      // await expect(catsService.findAll()).resolves.toBe(result);
    });
  });

  describe('create', () => {
    it('should add a new movie', async () => {
      // const movie: User = {
      //   id: 1,
      //   title: "Inception",
      //   description: "A skilled thief leads a team into dreams to steal secrets.",
      //   releaseDate: "2010-07-16",
      //   durationMinutes: 148,
      //   genre: ["Action", "Sci-Fi", "Thriller"],
      //   director: "Christopher Nolan",
      //   cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
      //   rating: 8.8,
      //   posterUrl: "https://example.com/inception.jpg",
      //   trailerUrl: "https://youtube.com/inception-trailer"
      // };
      // const expectedCatArray = [movie];
      //@ts-ignore
      expect(catsService.movies).toStrictEqual([]);

      // catsService.create(movie);
      //@ts-ignore
      expect(catsService.movies).toStrictEqual(expectedCatArray);
    });
  });
});

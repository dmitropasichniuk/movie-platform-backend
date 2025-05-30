import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

describe('CatsController', () => {
  let catsController: UsersController;
  let catsService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    catsService = moduleRef.get<UsersService>(UsersService);
    catsController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const movies: User[] = [
        // {
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
        // },
      ];
      // @ts-ignore
      catsService.movies = movies;

      // expect(await catsController.findAll()).toBe(movies);
    });
  });

  // describe('create', () => {
  //   it('should add a new user', async () => {
  //     const user: User = {
  //       id: 1,
  //       title: "Inception",
  //       description: "A skilled thief leads a team into dreams to steal secrets.",
  //       releaseDate: "2010-07-16",
  //       durationMinutes: 148,
  //       genre: ["Action", "Sci-Fi", "Thriller"],
  //       director: "Christopher Nolan",
  //       cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
  //       rating: 8.8,
  //       posterUrl: "https://example.com/inception.jpg",
  //       trailerUrl: "https://youtube.com/inception-trailer"
  //     };
  //     const expectedCatArray = [user];

  //     // @ts-ignore
  //     expect(catsService.movies).toStrictEqual([]);

  //     await catsController.create(user);

  //     // @ts-ignore
  //     expect(catsService.movies).toStrictEqual(expectedCatArray);
  //   });
  // });
});

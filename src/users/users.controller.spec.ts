import { Test } from "@nestjs/testing";
import { User, UsersController, UsersService } from "@users";

describe("MoviesController", () => {
  let moviesController: UsersController;
  let moviesService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    moviesService = moduleRef.get<UsersService>(UsersService);
    moviesController = moduleRef.get<UsersController>(UsersController);
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const movies: User[] = [
        // {
        //   id: 1,
        //   title: "Inception",
        //   description: "A skilled thief leads a team into dreams to steal secrets.",
        //   releaseDate: "2010-07-16",
        //   genre_ids: [27, 53, 878],
        //   rating: 8.8,
        //   posterUrl: "https://example.com/inception.jpg",
        //   videoId: "https://youtube.com/inception-trailer"
        // },
      ];
      // @ts-ignore
      moviesService.movies = movies;

      // expect(await moviesController.findAll()).toBe(movies);
    });
  });

  // describe('create', () => {
  //   it('should add a new user', async () => {
  //     const user: User = {
  //       id: 1,
  //       title: "Inception",
  //       description: "A skilled thief leads a team into dreams to steal secrets.",
  //       releaseDate: "2010-07-16",
  //       genre_ids: [27, 53, 878],
  //       rating: 8.8,
  //       posterUrl: "https://example.com/inception.jpg",
  //       videoId: "https://youtube.com/inception-trailer"
  //     };
  //     const expectedCatArray = [user];

  //     // @ts-ignore
  //     expect(moviesService.movies).toStrictEqual([]);

  //     await moviesController.create(user);

  //     // @ts-ignore
  //     expect(moviesService.movies).toStrictEqual(expectedCatArray);
  //   });
  // });
});

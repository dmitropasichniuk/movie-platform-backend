import { Test } from "@nestjs/testing";

import { UsersService } from "@users";

describe("MoviesService", () => {
  let moviesService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    moviesService = moduleRef.get<UsersService>(UsersService);
  });

  describe("findAll", () => {
    it("should return an array of movies", async () => {
      const result = [
        {
          id: 1,
          title: "Inception",
          description:
            "A skilled thief leads a team into dreams to steal secrets.",
          releaseDate: "2010-07-16",
          genre_ids: [27, 53, 878],
          rating: 8.8,
          posterUrl: "https://example.com/inception.jpg",
          videoId: "https://youtube.com/inception-trailer",
        },
      ];
      //@ts-ignore
      moviesService.movies = result;

      // await expect(moviesService.findAll()).resolves.toBe(result);
    });
  });

  describe("create", () => {
    it("should add a new movie", async () => {
      // const movie: User = {
      //   id: 1,
      //   title: "Inception",
      //   description: "A skilled thief leads a team into dreams to steal secrets.",
      //   releaseDate: "2010-07-16",
      //   genre_ids: [27, 53, 878],
      //   rating: 8.8,
      //   posterUrl: "https://example.com/inception.jpg",
      //   videoId: "https://youtube.com/inception-trailer"
      // };
      // const expectedCatArray = [movie];
      //@ts-ignore
      expect(moviesService.movies).toStrictEqual([]);

      // moviesService.create(movie);
      //@ts-ignore
      expect(moviesService.movies).toStrictEqual(expectedCatArray);
    });
  });
});

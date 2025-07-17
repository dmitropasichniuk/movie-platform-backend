import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { MoviesModule } from "../../src/movies/movies.module";
import { MoviesService } from "../../src/movies/movies.service";
import { CoreModule } from "../../src/core/core.module";

describe("Movies", () => {
  const moviesService = { findAll: () => ["test"] };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MoviesModule, CoreModule],
    })
      .overrideProvider(MoviesService)
      .useValue(moviesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET movies`, () => {
    return request(app.getHttpServer()).get("/movies").expect(200).expect({
      data: moviesService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

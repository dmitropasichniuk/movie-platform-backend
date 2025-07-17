import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { GenreService } from "./genre.service";
import { GenreEntity } from "@genre";

describe("GenreService - findAll()", () => {
  let service: GenreService;
  let genreRepo: jest.Mocked<Repository<GenreEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: getRepositoryToken(GenreEntity),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
    genreRepo = module.get(getRepositoryToken(GenreEntity));
  });

  it("should return list of genres", async () => {
    const mockGenres = [
      { externalId: 1, name: "Action" },
      { externalId: 2, name: "Comedy" },
    ] as GenreEntity[];

    genreRepo.find.mockResolvedValue(mockGenres);

    const result = await service.findAll();

    expect(genreRepo.find).toHaveBeenCalled();
    expect(result).toEqual(expect.arrayContaining(mockGenres));
  });

  it("should throw NotFoundException if no genres found", async () => {
    genreRepo.find.mockResolvedValue([]);

    await expect(service.findAll()).rejects.toThrow(NotFoundException);
  });
});

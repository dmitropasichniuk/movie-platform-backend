import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";

import { GenreEntity } from "./entities";
import { GenreResponseDto } from "./dto";

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>
  ) {}

  async findAll(): Promise<GenreResponseDto[]> {
    const genres = await this.genreRepository.find();

    if (!genres || genres.length === 0) {
      throw new NotFoundException("Genres not found");
    }

    return plainToInstance(GenreResponseDto, genres, {
      excludeExtraneousValues: true,
    });
  }
}

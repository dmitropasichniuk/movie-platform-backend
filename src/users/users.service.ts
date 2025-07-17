import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import {
  UserEntity,
  PaginatedUsers,
  QueryUsersDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserResponseDto,
} from "@users";
import { MovieResponseDto, MoviesService } from "@movies";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly moviesService: MoviesService
  ) {}

  async findAll(queryDto: QueryUsersDto): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, search, role } = queryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder("user");

    if (search) {
      queryBuilder.where(
        "(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    if (role) {
      queryBuilder.andWhere("user.role = :role", { role });
    }

    queryBuilder.orderBy("user.createdAt", "DESC").skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: users.map((user) =>
        plainToClass(UserResponseDto, user, {
          excludeExtraneousValues: true,
        })
      ),
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async findOneById(userId: string): Promise<UserResponseDto> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: { id: userId },
      withDeleted: false,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("User with this email already exists");
      }
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    return plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ["id", "password"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isMatch = await user.validatePassword(updatePasswordDto.oldPassword);
    if (!isMatch) {
      throw new UnauthorizedException("Old password is incorrect");
    }

    if (updatePasswordDto.newPassword.length < 8) {
      throw new BadRequestException(
        "New password must be at least 8 characters"
      );
    }

    if (updatePasswordDto.oldPassword === updatePasswordDto.newPassword) {
      throw new BadRequestException(
        "New password must differ from old password"
      );
    }

    user.password = updatePasswordDto.newPassword;
    const updatedUser = await this.usersRepository.save(user);

    return plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("User not found");
    }
  }

  async restore(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.deletedAt) {
      throw new BadRequestException("User was not deleted");
    }

    await this.usersRepository.restore(id);
  }

  async getUserFavourites(userId: string): Promise<MovieResponseDto[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["favouriteMovies"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.favouriteMovies.map((movie) =>
      plainToClass(MovieResponseDto, movie, {
        excludeExtraneousValues: true,
      })
    );
  }

  async addFavouriteMovie(userId: string, movieId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["favouriteMovies"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const movie = await this.moviesService.getMovieEntityByExternalId(movieId);
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }

    const alreadyAdded = user.favouriteMovies.some((m) => m.id === movie.id);
    if (alreadyAdded) {
      throw new ConflictException("Movie is already in favorites");
    }

    user.favouriteMovies.push(movie);
    await this.usersRepository.save(user);
  }

  async removeFavouriteMovie(userId: string, movieId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["favouriteMovies"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const movie = await this.moviesService.getMovieEntityByExternalId(movieId);
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }

    const wasFavourite = user.favouriteMovies.some((m) => m.id === movie.id);
    if (wasFavourite) {
      user.favouriteMovies = user.favouriteMovies.filter(
        (m) => m.id !== movie.id
      );
      await this.usersRepository.save(user);
    }
  }

  // TODO: In progress
  // async updateAvatar(userId: string, avatarPath: string): Promise<void> {
  //   const result = await this.usersRepository.update(userId, {
  //     avatar: avatarPath,
  //   });

  //   if (result.affected === 0) {
  //     throw new NotFoundException("User not found");
  //   }
  // }
}

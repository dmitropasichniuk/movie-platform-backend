import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUsers, User } from './interfaces/user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(createUserDto.email);
    console.log(typeof(createUserDto.age));
    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    
    return plainToClass(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(queryDto: QueryUsersDto): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, search, role } = queryDto;
    
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();
    
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: users.map(user => plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true,
      })),
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async findOneById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Користувач з таким email вже існує');
      }
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    return plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  // async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<UserResponseDto> {
  //   const user = await this.usersRepository.findOne({
  //     where: { id },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('Користувача не знайдено');
  //   }

  //   if (updateUserDto.email && updateUserDto.email !== user.email) {
  //     const existingUser = await this.findByEmail(updateUserDto.email);
  //     if (existingUser) {
  //       throw new ConflictException('Користувач з таким email вже існує');
  //     }
  //   }

  //   Object.assign(user, updateUserDto);
  //   const updatedUser = await this.usersRepository.save(user);

  //   return plainToClass(UserResponseDto, updatedUser, {
  //     excludeExtraneousValues: true,
  //   });
  // }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    await this.usersRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const user: Partial<UserEntity> = await this.usersRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (!user.deletedAt) {
      throw new BadRequestException('Користувач не був видалений');
    }

    await this.usersRepository.restore(id);
  }

  async updateAvatar(userId: string, avatarPath: string): Promise<void> {
    await this.usersRepository.update(userId, { avatar: avatarPath });
  }
}
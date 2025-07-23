import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";

import { UserEntity, CreateUserDto, LoginUserDto } from "@users";
import { AuthResponseDto } from "@auth";
import { UserRole } from "@enums";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async register(dto: CreateUserDto): Promise<AuthResponseDto> {
    const exists = await this.userRepo.findOne({
      where: { userName: dto.userName },
      select: ["id", "userName", "password"],
    });
    if (exists) throw new BadRequestException("This userName already in use");

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hash,
      role: UserRole.USER,
    });
    const savedUser = await this.userRepo.save(user);

    const accessToken = await this.generateJwt(savedUser);

    return plainToInstance(
      AuthResponseDto,
      {
        user: savedUser,
        accessToken,
      },
      { excludeExtraneousValues: true },
    );
  }

  async login(dto: LoginUserDto): Promise<AuthResponseDto> {
    if (!dto.password) {
      throw new BadRequestException("Password is required");
    }

    const userWithPassword = await this.userRepo.findOne({
      where: { userName: dto.userName },
      select: ["id", "userName", "password"],
    });
    if (!userWithPassword)
      throw new UnauthorizedException("Invalid credentials");

    const isMatch = await bcrypt.compare(
      dto.password,
      userWithPassword.password,
    );
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

    const accessToken = await this.generateJwt(userWithPassword);

    const fullUser = await this.userRepo.findOneOrFail({
      where: { id: userWithPassword.id },
    });

    return plainToInstance(
      AuthResponseDto,
      {
        user: fullUser,
        accessToken,
      },
      { excludeExtraneousValues: true },
    );
  }

  async validateUser(userId: string): Promise<UserEntity> {
    return this.userRepo.findOneBy({ id: userId });
  }

  private async generateJwt(user: UserEntity): Promise<string> {
    const payload = { sub: user.id };
    return this.jwtService.signAsync(payload);
  }
}

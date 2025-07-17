import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";

import { UserEntity, UserResponseDto } from "@users";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string }): Promise<UserResponseDto> {
    const user = await this.userRepo.findOneBy({ id: payload.sub });
    if (!user) throw new UnauthorizedException();
    return plainToInstance(UserResponseDto, user);
  }
}

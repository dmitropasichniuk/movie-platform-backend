import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersService } from "@users";
import { MoviesModule } from "@movies";
import { UsersController } from "./users.controller";
import { UserEntity } from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), MoviesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

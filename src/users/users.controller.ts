import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";

import {
  ApiPasswordResetThrottle,
  ApiSearchThrottle,
  CurrentUser,
  Roles,
} from "@decorators";
import {
  PaginatedUsers,
  QueryUsersDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserEntity,
  UserResponseDto,
  UsersService,
} from "@users";
import { JwtAuthGuard } from "@auth";
import { DefaultResponseDto } from "@dtos";
import { SelfOrAdminGuard } from "@guards";
import { MovieResponseDto } from "@movies";
import { UserRole } from "@enums";

@ApiTags("Users")
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Get list of users (admin only)" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 10,
    description: "Number of items per page (max 100)",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    example: "john",
    description: "Search by name, surname or email",
  })
  @ApiQuery({ name: "role", required: false, enum: UserRole })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User list retrieved successfully",
    type: DefaultResponseDto<PaginatedUsers>,
  })
  @ApiResponse({ status: 400, description: "Invalid query parameters" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Access denied" })
  @ApiSearchThrottle(200, 1)
  async findAll(
    @Query() queryDto: QueryUsersDto
  ): Promise<DefaultResponseDto<PaginatedUsers>> {
    const users = await this.usersService.findAll(queryDto);

    return {
      message: "User list retrieved successfully",
      data: users,
    };
  }

  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  @Get(":id")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Get user by UUID" })
  @ApiParam({
    name: "id",
    type: String,
    description: "User UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User data retrieved successfully",
    type: DefaultResponseDto<UserResponseDto>,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Insufficient permissions" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiSearchThrottle(200, 1)
  async findOne(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<DefaultResponseDto<UserResponseDto>> {
    const user = await this.usersService.findOneById(id);

    return {
      message: "User data retrieved successfully",
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  @Patch(":id")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Update user data" })
  @ApiParam({
    name: "id",
    type: String,
    description: "User UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      example1: {
        summary: "Update user data",
        value: {
          firstName: "Ivan",
          lastName: "Petrenko",
          email: "ivan@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User updated successfully",
    type: DefaultResponseDto<UserResponseDto>,
  })
  @ApiResponse({ status: 400, description: "Invalid data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Insufficient permissions" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 409,
    description: "User with this email already exists",
  })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<DefaultResponseDto<UserResponseDto>> {
    const user = await this.usersService.update(id, updateUserDto);

    return {
      message: "User updated successfully",
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch("password")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Update user password" })
  @ApiBody({
    type: UpdatePasswordDto,
    examples: {
      example1: {
        summary: "Update password",
        value: {
          oldPassword: "oldPass123",
          newPassword: "newPass456",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password updated successfully",
    type: DefaultResponseDto<UserResponseDto>,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 401, description: "Old password is incorrect" })
  @ApiPasswordResetThrottle(5, 1)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() userEntity: UserEntity
  ): Promise<DefaultResponseDto<UserResponseDto>> {
    const user = await this.usersService.updatePassword(
      userEntity.id,
      updatePasswordDto
    );

    return {
      message: "Password updated successfully",
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Delete user (soft delete)" })
  @ApiParam({
    name: "id",
    type: String,
    description: "UUID of the user to delete",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User deleted successfully",
    type: DefaultResponseDto<null>,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Access denied" })
  @ApiResponse({ status: 404, description: "User not found" })
  async remove(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<DefaultResponseDto<null>> {
    await this.usersService.remove(id);

    return {
      message: "User deleted successfully",
      data: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(":id/restore")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Restore a soft-deleted user" })
  @ApiParam({
    name: "id",
    type: String,
    description: "UUID of the soft-deleted user",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User restored successfully",
    type: DefaultResponseDto<null>,
  })
  @ApiResponse({ status: 400, description: "User was not deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Access denied" })
  @ApiResponse({ status: 404, description: "User not found" })
  async restore(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<DefaultResponseDto<null>> {
    await this.usersService.restore(id);

    return {
      message: "User restored successfully",
      data: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("favourites")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Get user's favorite movies" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Favorite movies retrieved successfully",
    schema: {
      example: {
        data: [
          {
            externalId: 550,
            title: "Fight Club",
            description:
              "An insomniac office worker crosses paths with a soap maker...",
            releaseDate: "1999-10-15",
            voteAverage: 8.8,
            voteCount: 26280,
            popularity: 61.416,
            adult: false,
            originalLanguage: "en",
            posterPath: "/uploads/posters/fight-club.jpg",
            backdropPath: "/uploads/backdrops/fight-club.jpg",
            genres: [
              { externalId: 18, name: "Drama" },
              { externalId: 53, name: "Thriller" },
            ],
          },
        ],
        message: "Favorite movies retrieved successfully",
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserFavourites(
    @CurrentUser() userEntity: UserEntity
  ): Promise<DefaultResponseDto<MovieResponseDto[]>> {
    const favouriteMovies = await this.usersService.getUserFavourites(
      userEntity.id
    );
    return {
      message: "Favorite movies retrieved successfully",
      data: favouriteMovies,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("favourites/:movieId")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Add movie to favorites" })
  @ApiParam({
    name: "movieId",
    type: Number,
    description: "Movie ID from TMDB",
    example: 12345,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Movie added to favorites",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 404,
    description: "User or movie not found",
  })
  @ApiResponse({ status: 409, description: "Movie already in favorites" })
  async addFavouriteMovie(
    @Param("movieId", ParseIntPipe) movieId: number,
    @CurrentUser() userEntity: UserEntity
  ): Promise<DefaultResponseDto<null>> {
    await this.usersService.addFavouriteMovie(userEntity.id, movieId);

    return {
      message: "Movie added to favorites",
      data: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("favourites/:movieId")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Remove movie from user's favorites" })
  @ApiParam({
    name: "movieId",
    type: Number,
    description: "Movie ID from TMDB",
    example: 12345,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Movie removed from favorites",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 404,
    description: "User or movie not found",
  })
  async removeFavourite(
    @Param("movieId", ParseIntPipe) movieId: number,
    @CurrentUser() userEntity: UserEntity
  ): Promise<DefaultResponseDto<null>> {
    await this.usersService.removeFavouriteMovie(userEntity.id, movieId);

    return {
      message: "Movie removed from favorites",
      data: null,
    };
  }

  // TODO: In progress
  // @UseGuards(JwtAuthGuard)
  // @Post("avatar")
  // @ApiBearerAuth("jwt")
  // @ApiOperation({ summary: "Upload user avatar image" })
  // @ApiConsumes("multipart/form-data")
  // @ApiBody({
  //   schema: {
  //     type: "object",
  //     properties: {
  //       file: {
  //         type: "string",
  //         format: "binary",
  //         description: "Avatar image file (JPG, PNG, GIF)",
  //       },
  //     },
  //     required: ["file"],
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "File uploaded successfully",
  //   schema: {
  //     example: {
  //       avatar: "/uploads/avatars/avatar123.jpg",
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: "Invalid file or file size exceeded",
  // })
  // @ApiResponse({ status: 401, description: "Unauthorized" })
  // @ApiResponse({ status: 404, description: "User not found" })
  // @ApiResponse({ status: 413, description: "File too large" })
  // @ApiResponse({ status: 415, description: "Unsupported file type" })
  // @UseInterceptors(
  //   FileInterceptor("file", {
  //     storage: avatarStorage,
  //     fileFilter: avatarFileFilter,
  //     limits: avatarLimits,
  //   })
  // )
  // async uploadAvatar(
  //   @UploadedFile() file: MulterFile,
  //   @CurrentUser() userEntity: UserEntity
  // ) {
  //   if (!file) {
  //     throw new BadRequestException("No file provided");
  //   }

  //   try {
  //     const avatarUrl = `/uploads/avatars/${file.filename}`;
  //     await this.usersService.updateAvatar(userEntity.id, avatarUrl);

  //     return {
  //       avatar: avatarUrl,
  //       message: "Avatar uploaded successfully",
  //     };
  //   } catch (error) {
  //     if (file?.path) {
  //       try {
  //         await fs.unlink(file.path);
  //       } catch (unlinkError) {
  //         console.error("Error while deleting file:", unlinkError);
  //       }
  //     }

  //     throw error;
  //   }
  // }

  // function avatarFileFilter(
  //   req: any,
  //   file: {
  //     fieldname: string;
  //     originalname: string;
  //     encoding: string;
  //     mimetype: string;
  //     size: number;
  //     destination: string;
  //     filename: string;
  //     path: string;
  //     buffer: Buffer<ArrayBufferLike>;
  //   },
  //   callback: (error: Error, acceptFile: boolean) => void
  // ): void {
  //   throw new Error("Function not implemented.");
  // }
}

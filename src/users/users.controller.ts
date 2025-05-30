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
  // HttpStatus,
  // UseGuards,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { File as MulterFile } from 'multer';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiParam,
//   ApiQuery,
// } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UserResponseDto } from './dto/user-response.dto';
// import { IApiResponse } from './interfaces/user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from 'src/common/upload/avatar-storage.config';
import { avatarFileFilter } from 'src/common/upload/avatar-filter.config';
import { avatarLimits } from 'src/common/upload/avatar-limits.config';
import { DefaultResponseDto } from 'src/common/dto';
import { PaginatedUsers } from './interfaces/user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

// @ApiTags('Users')
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @ApiOperation({ summary: 'Створити нового користувача' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Користувача успішно створено',
  //   type: UserResponseDto,
  // })
  async create(@Body() createUserDto: CreateUserDto): Promise<DefaultResponseDto<UserResponseDto>> {
    const user = await this.usersService.create(createUserDto);
    
    return {
      status: 201,
      success: true,
      message: 'Користувача успішно створено',
      data: user,
    };
  }

  @Get()
  // @ApiOperation({ summary: 'Отримати список користувачів' })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  // @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiQuery({ name: 'search', required: false, type: String })
  // @ApiQuery({ name: 'role', required: false, enum: ['user', 'admin'] })
  async findAll(@Query() queryDto: QueryUsersDto): Promise<DefaultResponseDto<PaginatedUsers>> {
    const result = await this.usersService.findAll(queryDto);
    
    return {
      status: 200,
      success: true,
      message: 'Користувачів успішно отримано',
      data: result,
    };
  }

  @Get(':id')
  // @ApiOperation({ summary: 'Отримати користувача за ID' })
  // @ApiParam({ name: 'id', type: String, description: 'UUID користувача' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DefaultResponseDto<UserResponseDto>> {
    const user = await this.usersService.findOneById(id);
    
    return {
      status: 200,
      success: true,
      message: 'Користувача успішно знайдено',
      data: user,
    };
  }

  @Patch(':id')
  // @ApiOperation({ summary: 'Оновити дані користувача' })
  // @ApiParam({ name: 'id', type: String, description: 'UUID користувача' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<DefaultResponseDto<UserResponseDto>> {
    const user = await this.usersService.update(id, updateUserDto);
    
    return {
      success: true,
      message: 'Користувача успішно оновлено',
      data: user,
    };
  }

  // @Patch(':id')
  // // // @ApiOperation({ summary: 'Оновити пароль користувача' })
  // // // @ApiParam({ name: 'id', type: String, description: 'UUID користувача' })
  // async updatePassword(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updatePasswordDto: UpdatePasswordDto,
  // ): Promise<DefaultResponseDto<UserResponseDto>> {
  //   const user = await this.usersService.updatePassword(id, updatePasswordDto);
    
  //   return {
  //     success: true,
  //     message: 'Пароль успішно оновлено',
  //     data: user,
  //   };
  // }

  @Delete(':id')
  // @ApiOperation({ summary: 'Видалити користувача' })
  // @ApiParam({ name: 'id', type: String, description: 'UUID користувача' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DefaultResponseDto> {
    await this.usersService.remove(id);
    
    return {
      status: 200,
      success: true,
      message: 'Користувача успішно видалено',
      data: null,
    };
  }

  @Patch(':id/restore')
  // @ApiOperation({ summary: 'Відновити м’яко видаленого користувача' })
  // @ApiParam({ name: 'id', type: String, description: 'UUID користувача' })
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<DefaultResponseDto> {
    await this.usersService.restore(id);

    return {
      status: 200,
      success: true,
      message: 'Користувача успішно відновлено',
      data: null,
    };
  }


  // @UseGuards(JwtAuthGuard) // якщо юзер має бути авторизований
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: avatarLimits,
  }))
  async uploadAvatar(
    @UploadedFile() file: MulterFile,
    @Req() req: any,
  ) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.usersService.updateAvatar(req.user.id, avatarUrl);
    return { avatar: avatarUrl };
  }
}
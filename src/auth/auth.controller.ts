import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { AuthResponseDto, AuthService, JwtAuthGuard } from "@auth";
import { ApiAuthThrottle, CurrentUser } from "@decorators";
import { CreateUserDto, LoginUserDto, UserResponseDto } from "@users";
import { DefaultResponseDto } from "@dtos";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User successfully created",
    type: DefaultResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: "Username is already taken",
  })
  @ApiAuthThrottle(5, 1)
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<DefaultResponseDto<AuthResponseDto>> {
    const data = await this.authService.register(createUserDto);

    return {
      message: "User successfully created",
      data,
    };
  }

  @Post("login")
  @ApiOperation({ summary: "Log in the user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User successfully logged in",
    type: DefaultResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: "Password is required",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid username or password",
  })
  @ApiAuthThrottle(5, 1)
  async login(
    @Body() dto: LoginUserDto
  ): Promise<DefaultResponseDto<AuthResponseDto>> {
    const data = await this.authService.login(dto);

    return {
      message: "User successfully logged in",
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiBearerAuth("jwt")
  @ApiOperation({ summary: "Get current user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Current user information",
    type: DefaultResponseDto<UserResponseDto>,
  })
  getMe(
    @CurrentUser() user: UserResponseDto
  ): DefaultResponseDto<UserResponseDto> {
    return {
      message: "User successfully logged in",
      data: user,
    };
  }
}

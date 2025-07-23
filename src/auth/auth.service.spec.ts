import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { UserRole } from "@enums";
import { CreateUserDto, LoginUserDto, UserEntity } from "@users";
import { JwtService } from "@nestjs/jwt";

jest.mock("bcrypt");
const bcryptHashMock = bcrypt.hash as jest.Mock;
const bcryptCompareMock = bcrypt.compare as jest.Mock;

let service: AuthService;
let userRepo: jest.Mocked<Repository<UserEntity>>;
let jwtService: jest.Mocked<JwtService>;

const createRegisterUserData = (): CreateUserDto => ({
  userName: "test",
  password: "password",
  email: "test@test.com",
});

const createLoginUserData = (): LoginUserDto => ({
  userName: "test",
  password: "password",
});

const userEntityFactory = (): UserEntity =>
  ({
    id: "1",
    email: "test@test.com",
    userName: "test",
    password: "password",
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as UserEntity;

describe("AuthService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get(JwtService);
  });

  describe("register()", () => {
    it("should register new user", async () => {
      const registerDto = createRegisterUserData();

      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({
        id: 1,
        ...registerDto,
      } as unknown as UserEntity);
      userRepo.save.mockResolvedValue({
        id: 1,
        ...registerDto,
      } as unknown as UserEntity);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      const result = await service.register(registerDto);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("accessToken");
    });

    it("should throw error if user exists", async () => {
      const registerDto = createRegisterUserData();

      userRepo.findOne.mockResolvedValue({ id: 1 } as unknown as UserEntity);

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should hash password", async () => {
      const registerDto = createRegisterUserData();

      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({} as UserEntity);
      userRepo.save.mockResolvedValue({} as UserEntity);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    });

    it("should set USER role", async () => {
      const registerDto = createRegisterUserData();

      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({} as UserEntity);
      userRepo.save.mockResolvedValue({} as UserEntity);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      await service.register(registerDto);

      expect(userRepo.create).toHaveBeenCalledWith({
        ...registerDto,
        password: "hashed",
        role: UserRole.USER,
      });
    });

    it("should generate JWT token", async () => {
      const userEntity = userEntityFactory();
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(userEntity);
      userRepo.save.mockResolvedValue(userEntity);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      await service.register(userEntity);

      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: "1" });
    });
  });

  describe("login()", () => {
    it("should login user and return accessToken and user", async () => {
      const loginDto = createLoginUserData();
      const userEntity = userEntityFactory();

      userRepo.findOne.mockResolvedValueOnce(userEntity);
      userRepo.findOneOrFail.mockResolvedValue(userEntity);

      bcryptCompareMock.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue("token");

      const result = await service.login(loginDto);

      expect(result).toHaveProperty("accessToken", "token");
      expect(result).toHaveProperty("user");
      expect(result.user).toMatchObject({ userName: "test" });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: "1" });
    });

    it("should throw if password not provided", async () => {
      await expect(
        service.login({ userName: "test", password: "" })
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw if user not found", async () => {
      const loginDto = createLoginUserData();
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw if password does not match", async () => {
      const userEntity = userEntityFactory();

      userRepo.findOne.mockResolvedValue(userEntity);
      bcryptCompareMock.mockResolvedValue(false);

      await expect(service.login(userEntity)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});

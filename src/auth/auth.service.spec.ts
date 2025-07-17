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

const registerUserData: CreateUserDto = {
  userName: "test",
  password: "password",
  email: "test@test.com",
};

const loginUserData: LoginUserDto = {
  userName: "test",
  password: "password",
};

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
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({
        id: 1,
        ...registerUserData,
      } as unknown as UserEntity);
      userRepo.save.mockResolvedValue({
        id: 1,
        ...registerUserData,
      } as unknown as UserEntity);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      const result = await service.register(registerUserData);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("accessToken");
    });

    it("should throw error if user exists", async () => {
      userRepo.findOne.mockResolvedValue({ id: 1 } as unknown as UserEntity);

      await expect(service.register(registerUserData)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should hash password", async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({} as UserEntity);
      userRepo.save.mockResolvedValue({} as UserEntity);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      await service.register(registerUserData);

      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    });

    it("should set USER role", async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({} as UserEntity);
      userRepo.save.mockResolvedValue({} as UserEntity);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      await service.register(registerUserData);

      expect(userRepo.create).toHaveBeenCalledWith({
        ...registerUserData,
        password: "hashed",
        role: UserRole.USER,
      });
    });

    it("should generate JWT token", async () => {
      const savedUser = { id: 1, ...registerUserData } as unknown as UserEntity;
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(savedUser);
      userRepo.save.mockResolvedValue(savedUser);
      bcryptHashMock.mockResolvedValue("hashed");
      jwtService.signAsync.mockResolvedValue("token");

      await service.register(registerUserData);

      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1 });
    });
  });

  describe("login()", () => {
    it("should login user and return accessToken and user", async () => {
      const userWithPassword = {
        id: 1,
        userName: loginUserData.userName,
        password: "hashedPassword",
      } as unknown as UserEntity;

      const fullUser = {
        ...userWithPassword,
        email: "test@test.com",
        role: UserRole.USER,
      } as unknown as UserEntity;

      userRepo.findOne
        .mockResolvedValueOnce(userWithPassword)
        .mockResolvedValueOnce(fullUser);
      userRepo.findOneOrFail.mockResolvedValue(fullUser);

      bcryptCompareMock.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue("token");

      const result = await service.login(loginUserData);

      expect(result).toHaveProperty("accessToken", "token");
      expect(result).toHaveProperty("user");
      expect(result.user).toMatchObject({ userName: "test" });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1 });
    });

    it("should throw if password not provided", async () => {
      await expect(
        service.login({ userName: "test", password: "" })
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw if user not found", async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.login(loginUserData)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw if password does not match", async () => {
      const userWithPassword = {
        id: 1,
        userName: loginUserData.userName,
        password: "hashedPassword",
      } as unknown as UserEntity;

      userRepo.findOne.mockResolvedValue(userWithPassword);
      bcryptCompareMock.mockResolvedValue(false);

      await expect(service.login(loginUserData)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});

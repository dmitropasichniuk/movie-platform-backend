import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { Repository, UpdateResult } from "typeorm";
import { UserEntity } from "./entities";
import { MoviesService } from "@movies";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserResponseDto } from "./dto";
import { UserRole } from "@enums";

let service: UsersService;
let repo: jest.Mocked<Repository<UserEntity>>;
let moviesService: MoviesService;

export const userEntityFactory = (
  overrides: Partial<UserEntity> = {}
): UserEntity => {
  return {
    id: "1",
    userName: "TestUser",
    email: "test@example.com",
    password: "hashedPassword",
    firstName: "Test",
    lastName: "User",
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    avatar: null,
    ...overrides,
  } as UserEntity;
};

describe("UserService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
          },
        },
        {
          provide: MoviesService,
          useValue: {
            getMovieEntityByExternalId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repo = module.get(getRepositoryToken(UserEntity));
    moviesService = module.get(MoviesService);
  });

  describe("findOneById", () => {
    it("should return user if found", async () => {
      const mockUser = userEntityFactory();
      repo.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.findOneById("1");

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        withDeleted: false,
      });
      expect(result).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        userName: mockUser.userName,
      });
    });

    it("should throw NotFoundException if user not found", async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOneById("2")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByEmail", () => {
    it("should return user if found", async () => {
      const mockUser = userEntityFactory();
      repo.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.findByEmail(mockUser.email);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const mockUser = userEntityFactory();
      const updateData = { userName: "NewName" };
      const updatedUser = { ...mockUser, ...updateData } as UserEntity;

      repo.findOne.mockResolvedValueOnce(mockUser);
      repo.save.mockResolvedValueOnce(updatedUser);

      const result = await service.update("1", updateData);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(repo.save).toHaveBeenCalledWith({
        ...mockUser,
        ...updateData,
      });
      expect(result).toBeInstanceOf(UserResponseDto);
    });

    it("should throw ConflictException when email already exists", async () => {
      const mockUser = userEntityFactory();
      const updateData = { email: "existing@example.com" };
      const existingUser = { id: "2", email: "existing@example.com" };

      repo.findOne.mockResolvedValueOnce(mockUser);
      const findByEmailSpy = jest
        .spyOn(service, "findByEmail")
        .mockResolvedValueOnce(existingUser as UserEntity);

      await expect(service.update("1", updateData)).rejects.toThrow(
        ConflictException
      );

      expect(findByEmailSpy).toHaveBeenCalledWith("existing@example.com");
    });
  });

  describe("updatePassword", () => {
    it("should update password successfully", async () => {
      const mockUser = userEntityFactory();
      const updatePasswordDto = {
        oldPassword: "oldpass123",
        newPassword: "newpass123",
      };

      const userWithPassword = {
        ...mockUser,
        validatePassword: jest.fn().mockResolvedValue(true),
      } as unknown as UserEntity;

      repo.findOne.mockResolvedValueOnce(userWithPassword);
      repo.save.mockResolvedValueOnce(userWithPassword);

      const result = await service.updatePassword("1", updatePasswordDto);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        select: ["id", "password"],
      });
      expect(userWithPassword.validatePassword).toHaveBeenCalledWith(
        "oldpass123"
      );
      expect(result).toBeInstanceOf(UserResponseDto);
    });

    it("should throw UnauthorizedException for wrong old password", async () => {
      const mockUser = userEntityFactory();
      const updatePasswordDto = {
        oldPassword: "wrongpass",
        newPassword: "newpass123",
      };

      const userWithPassword = {
        ...mockUser,
        validatePassword: jest.fn().mockResolvedValue(false),
      } as unknown as UserEntity;

      repo.findOne.mockResolvedValueOnce(userWithPassword);

      await expect(
        service.updatePassword("1", updatePasswordDto)
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw BadRequestException when old and new passwords are same", async () => {
      const mockUser = userEntityFactory();
      const updatePasswordDto = {
        oldPassword: "samepass123",
        newPassword: "samepass123",
      };

      const userWithPassword = {
        ...mockUser,
        validatePassword: jest.fn().mockResolvedValue(true),
      } as unknown as UserEntity;

      repo.findOne.mockResolvedValueOnce(userWithPassword);

      await expect(
        service.updatePassword("1", updatePasswordDto)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("remove", () => {
    it("should soft delete user successfully", async () => {
      const mockDeleteResult: Partial<UpdateResult> = { affected: 1, raw: {} };

      repo.softDelete.mockResolvedValueOnce(mockDeleteResult as UpdateResult);

      await service.remove("1");

      expect(repo.softDelete).toHaveBeenCalledWith("1");
      expect(repo.softDelete).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException when user not found", async () => {
      const mockDeleteResult: Partial<UpdateResult> = { affected: 0, raw: {} };

      repo.softDelete.mockResolvedValueOnce(mockDeleteResult as UpdateResult);

      await expect(service.remove("nonexistent-id")).rejects.toThrow(
        NotFoundException
      );

      expect(repo.softDelete).toHaveBeenCalledWith("nonexistent-id");
    });

    it("should throw NotFoundException when user already deleted", async () => {
      const mockDeleteResult: Partial<UpdateResult> = { affected: 0, raw: {} };

      repo.softDelete.mockResolvedValueOnce(mockDeleteResult as UpdateResult);

      await expect(service.remove("already-deleted-id")).rejects.toThrow(
        NotFoundException
      );

      expect(repo.softDelete).toHaveBeenCalledWith("already-deleted-id");
    });
  });

  describe("restore", () => {
    it("should restore soft deleted user", async () => {
      const mockUser = userEntityFactory();
      const deletedUser = {
        ...mockUser,
        deletedAt: new Date(),
      } as UserEntity;

      repo.findOne.mockResolvedValueOnce(deletedUser);
      repo.restore.mockResolvedValueOnce({ affected: 1 } as UpdateResult);

      await service.restore("1");

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        withDeleted: true,
      });
      expect(repo.restore).toHaveBeenCalledWith("1");
    });

    it("should throw BadRequestException if user was not deleted", async () => {
      const mockUser = userEntityFactory();
      const notDeletedUser = {
        ...mockUser,
        deletedAt: null,
      } as UserEntity;

      repo.findOne.mockResolvedValueOnce(notDeletedUser);

      await expect(service.restore("1")).rejects.toThrow(BadRequestException);
    });
  });
});

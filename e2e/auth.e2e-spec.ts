import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import * as request from "supertest";
import { TestAppModule } from "./utils/test-app.module";
import { UserEntity } from "../src/users/entities/user.entity";
import { clearDatabase } from "./utils";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../src/auth/guards/jwt-auth.guard";

const testData = {
  validUser: {
    email: "test@example.com",
    password: "StrongPassword123!",
    userName: "TestUser",
  },

  invalidEmail: {
    email: "not-an-email",
    password: "StrongPassword123!",
    userName: "Test User",
  },

  weakPassword: {
    email: "test@example.com",
    password: "123",
    userName: "Test User",
  },

  missingFields: {
    email: "test@example.com",
  },

  emptyFields: {
    email: "",
    password: "",
    userName: "",
  },
};

const loginCredentials = {
  valid: {
    email: testData.validUser.email,
    password: testData.validUser.password,
  },

  invalidPassword: {
    email: testData.validUser.email,
    password: "WrongPassword",
  },

  nonExistentUser: {
    email: "nonexistent@example.com",
    password: "SomePassword123",
  },
};

describe("Auth (e2e)", () => {
  let app: INestApplication;
  let db: DataSource;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(APP_GUARD)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      })
    );

    await app.init();

    db = moduleRef.get(DataSource);
    userRepository = db.getRepository(UserEntity);
  });

  afterAll(async () => {
    if (db) await db.destroy();
    if (app) await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(db);
  });

  const registerUser = (userData = testData.validUser) => {
    return request(app.getHttpServer()).post("/auth/register").send(userData);
  };

  const loginUser = (credentials = loginCredentials.valid) => {
    return request(app.getHttpServer()).post("/auth/login").send(credentials);
  };

  describe("User Registration", () => {
    it("should register a user successfully", async () => {
      const res = await registerUser().expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        email: testData.validUser.email,
        userName: testData.validUser.userName,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(res.body).not.toHaveProperty("password");

      const userInDb = await userRepository.findOne({
        where: { email: testData.validUser.email },
      });
      expect(userInDb).toBeDefined();
      expect(userInDb?.email).toBe(testData.validUser.email);
    });

    it("should return 409 when user already exists", async () => {
      await registerUser().expect(201);

      const res = await registerUser().expect(409);

      expect(res.body).toMatchObject({
        statusCode: 409,
        message: expect.stringContaining("already exists"),
        error: "Conflict",
      });
    });

    it("should return 400 for invalid email format", async () => {
      const res = await registerUser(testData.invalidEmail).expect(400);

      expect(res.body).toMatchObject({
        statusCode: 400,
        message: expect.arrayContaining([expect.stringContaining("email")]),
        error: "Bad Request",
      });
    });

    it("should return 400 for weak password", async () => {
      const res = await registerUser(testData.weakPassword).expect(400);

      expect(res.body).toMatchObject({
        statusCode: 400,
        message: expect.arrayContaining([expect.stringContaining("password")]),
        error: "Bad Request",
      });
    });

    it("should return 400 for missing required fields", async () => {
      const res = await registerUser(testData.missingFields as any).expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining("password"),
          expect.stringContaining("userName"),
        ])
      );
    });

    it("should return 400 for empty fields", async () => {
      const res = await registerUser(testData.emptyFields).expect(400);

      expect(res.body.message.length).toBeGreaterThan(0);
      expect(res.body.statusCode).toBe(400);
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      await registerUser().expect(201);
    });

    it("should login successfully with valid credentials", async () => {
      const res = await loginUser().expect(200);

      expect(res.body).toMatchObject({
        access_token: expect.any(String),
        user: {
          id: expect.any(Number),
          email: testData.validUser.email,
          userName: testData.validUser.userName,
        },
      });

      expect(res.body.access_token.length).toBeGreaterThan(0);
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return 401 for invalid password", async () => {
      const res = await loginUser(loginCredentials.invalidPassword).expect(401);

      expect(res.body).toMatchObject({
        statusCode: 401,
        message: expect.stringContaining("Invalid credentials"),
        error: "Unauthorized",
      });
    });

    it("should return 401 for non-existent user", async () => {
      const res = await loginUser(loginCredentials.nonExistentUser).expect(401);

      expect(res.body.statusCode).toBe(401);
    });

    it("should return 400 for malformed login request", async () => {
      const res = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email: "not-email", password: "" })
        .expect(400);

      expect(res.body.statusCode).toBe(400);
    });
  });
});

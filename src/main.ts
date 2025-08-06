import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as express from "express";
import { join } from "path";
import helmet from "helmet";
import { Logger } from "@nestjs/common";
import * as morgan from "morgan";

import { AppModule } from "./app.module";
import { addSwaggerRateLimitResponse } from "@utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Logger configuration
  app.useLogger(["log", "error", "warn", "debug", "verbose"]);

  // Helmet for security
  app.use(helmet({ crossOriginResourcePolicy: false }));

  // Morgan for logging HTTP requests
  app.use(morgan("dev"));

  // Validation pipe configuration
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // CORS
  app.enableCors({
    origin: ["http://localhost:5173", "https://flickly-web.vercel.app"],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Flickly")
    .setDescription("API Flickly documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "jwt"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  addSwaggerRateLimitResponse(document);
  SwaggerModule.setup("api", app, document);

  // Serve static files
  app.use("/uploads", express.static(join(__dirname, "..", "uploads")));

  await app.listen(process.env.BACKEND_PORT ?? 3001);

  // Log the server running message
  const logger = new Logger("Bootstrap");
  logger.log(
    `Server running on http://localhost:${process.env.BACKEND_PORT ?? 3001}`
  );
}
bootstrap();

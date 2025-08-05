# 🎬 Movie Review Platform (Flickly) — Backend

**Flickly** is a backend for a movie discovery and review platform. Users can explore movies, fetch trailers directly from YouTube, browse by genre, and manage their list of favorite titles.

This project was built to strengthen skills in fullstack development using **NestJS**, **PostgreSQL**, and **Docker**, with a strong focus on scalable REST API architecture, validation, authentication, and comprehensive testing (unit, integration).

---

## Tech Stack

- **NestJS** – backend framework
- **PostgreSQL** – relational database
- **TypeORM** – data mapping
- **Docker** – containerized environment
- **Jest** – unit, integration, and e2e testing
- **YouTube API** – to fetch trailers
- **Swagger (OpenAPI)** – API documentation

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dmitropasichniuk/movie-platform-backend.git
```
Switch to the repo folder
```bash
cd movie-platform
```

### 2. Environment variables

Create your `.env` file from the example:
```bash
cp .env.example .env
```

### 3. Run with Docker

```bash
docker compose up --build
```

### 4. Running Tests

#### Unit & Integration tests
To run unit and integration tests:
```bash
npm run test
```
---

## 5. Database & Seeding

This project uses **PostgreSQL** as the primary database, running in a dedicated Docker container.

#### Configuration
Database credentials are managed via environment variables in the `.env` file:
DB_HOST=movie_db
DB_PORT=5432
DB_NAME=movie_platform
DB_USERNAME=postgres
DB_PASSWORD=yourpassword

#### Data Model Overview
  **users**
  Users can mark movies as favourites:
    @ManyToMany(() => MovieEntity, { eager: true })
    @JoinTable()
    favouriteMovies?: MovieEntity[];
  **movies**
  Movies have multiple genres::
    @ManyToMany(() => GenreEntity)
    @JoinTable()
    genres: GenreEntity[];
  **genres**
  Basic genre list seeded during startup.

#### Seeding

The seeding script inserts a predefined set of genres and movies into the database.
Initial data is seeded **automatically** on container startup via the following Docker command:

```yaml
command: sh -c "npm run seed && nest start --watch"
```

---

## API Endpoints

All API endpoints are available under:

- **Base URL**: `http://localhost:3001`
- **Swagger UI**: `http://localhost:3001/api`

The API is fully documented using Swagger (OpenAPI). You can explore all routes, request parameters, and responses there.
Authentication is required for some endpoints. Use the JWT token in the `Authorization` header (`Bearer <token>`).

---

## Linting & Formatting

The project uses **ESLint** for code linting and **Prettier** for formatting.

### Installed Tools
- `eslint`
- `@typescript-eslint/*`
- `prettier`
- `eslint-config-prettier`

### Run Linter
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

---


## Project Structure

```bash
  src/
  ├── auth/              → User authentication (JWT, login, register)
  ├── common/            → Shared modules: constants, decorators, filters, guards, utils
    ├── youtube/ → External API integration for fetching movie trailers from YouTube
  ├── database/          → DB config, seeders, data transformations
  ├── genre/             → Genre module (CRUD, DTOs, service, controller, entity)
  ├── movies/            → Movie module (CRUD, DTOs, service, controller, entitie)
  ├── users/             → User module (CRUD, DTOs, service, controller, entitie)
```

### Other folders
- `.vscode/ — settings for the development environment`
- `e2e/ — end-to-end tests`
- `node_modules/ — project dependencies`

---

## Author

Created by [Dmytro Pasichniuk](https://www.linkedin.com/in/dmytro-pasichniuk)  
[GitHub Profile](https://github.com/dmitropasichniuk)

This project was built as part of my personal learning journey to strengthen and grow my skills as a **Fullstack Developer**.  
It serves as the **backend** layer of a movie platform application.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Notes

This project is developed as an MVP to demonstrate core backend features for a movie review platform.  
I'm open to constructive feedback and suggestions for improvement — feel free to reach out or open an issue.


import { AppDataSource, seedMovies, seedGenres, SeederFn } from "@db-seed";
import { LoggerService } from "@utils";

const seeders: SeederFn[] = [seedGenres, seedMovies];

export async function runAllSeeders() {
  await AppDataSource.initialize();

  for (const seed of seeders) {
    await seed(AppDataSource);
  }

  LoggerService.log("RunSeed", "All seeders completed");
  process.exit(0);
}

runAllSeeders().catch((err) => {
  LoggerService.error("RunSeed", `Seeding error: ${err}`, err.stack);
  process.exit(1);
});

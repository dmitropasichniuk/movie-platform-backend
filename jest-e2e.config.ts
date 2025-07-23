import type { Config } from "jest";
import baseConfig from "./jest.config";

const e2eConfig: Config = {
  ...baseConfig,
  rootDir: "./",
  testRegex: ".*\\.e2e-spec\\.ts$",
  setupFiles: ["dotenv/config"],
  collectCoverage: false,
  moduleNameMapper: {
    "^@constants$": "<rootDir>/src/common/constants",
    "^@decorators$": "<rootDir>/src/common/decorators",
    "^@dtos$": "<rootDir>/src/common/dto",
    "^@enums$": "<rootDir>/src/common/enums",
    "^@filters$": "<rootDir>/src/common/filters",
    "^@guards$": "<rootDir>/src/common/guards",
    "^@interceptors$": "<rootDir>/src/common/interceptors",
    "^@upload$": "<rootDir>/src/common/upload",
    "^@utils$": "<rootDir>/src/common/utils",
    "^@youtube$": "<rootDir>/src/common/youtube",
    "^@core$": "<rootDir>/src/core",
    "^@auth$": "<rootDir>/src/auth",
    "^@genre$": "<rootDir>/src/genre",
    "^@movies$": "<rootDir>/src/movies",
    "^@users$": "<rootDir>/src/users",
    "^@db-seed$": "<rootDir>/src/database",
    "^movies/(.*)$": "<rootDir>/src/movies/$1",
    "^genre/(.*)$": "<rootDir>/src/genre/$1",
  },
};

export default e2eConfig;

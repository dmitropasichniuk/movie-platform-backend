import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@constants$": "<rootDir>/common/constants",
    "^@decorators$": "<rootDir>/common/decorators",
    "^@dtos$": "<rootDir>/common/dto",
    "^@enums$": "<rootDir>/common/enums",
    "^@filters$": "<rootDir>/common/filters",
    "^@guards$": "<rootDir>/common/guards",
    "^@interceptors$": "<rootDir>/common/interceptors",
    "^@upload$": "<rootDir>/common/upload",
    "^@utils$": "<rootDir>/common/utils",
    "^@youtube$": "<rootDir>/common/youtube",
    "^@core$": "<rootDir>/core",
    "^@auth$": "<rootDir>/auth",
    "^@genre$": "<rootDir>/genre",
    "^@movies$": "<rootDir>/movies",
    "^@users$": "<rootDir>/users",
    "^@db-seed$": "<rootDir>/database",
    "^movies/(.*)$": "<rootDir>/movies/$1",
    "^genre/(.*)$": "<rootDir>/genre/$1",
  },
};

export default config;

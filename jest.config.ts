export default {
  clearMocks: true,
  moduleFileExtensions: ["ts", "js"],
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  setupFilesAfterEnv: ["jest-extended"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};

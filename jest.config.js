module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!@material/material-color-utilities).+\\.js$',
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/src/colors/material-color-utilities/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};

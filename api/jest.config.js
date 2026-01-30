const { createDefaultPreset } = require('ts-jest');
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  coverageProvider: 'v8',
  reporters: ['default', 'jest-html-reporters'],
  // testMatch: ['./src/*.spec.ts'],
  testPathIgnorePatterns: [
    '/node_modules/', // Already a default
    '/dist/',
  ],
};

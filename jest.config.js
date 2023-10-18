/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['./src/'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
}

module.exports = createJestConfig(config)

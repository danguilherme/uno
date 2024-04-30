module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/test/**/*.(ts|js)'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': ['ts-jest', { babel: true, tsConfig: 'tsconfig.json' }],
  },
};

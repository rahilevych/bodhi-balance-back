export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest', // или ts-jest, если TypeScript
  },
  collectCoverage: true, // включаем сбор покрытия
  coverageDirectory: 'coverage', // куда сохранять отчёт
  coverageReporters: ['text', 'html'], // текст + HTML
  collectCoverageFrom: [
    // какие файлы учитывать
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/main.js'],
};

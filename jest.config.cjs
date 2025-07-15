module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^swiper/react$': '<rootDir>/__mocks__/swiper/react.js',
    '^swiper/modules$': '<rootDir>/__mocks__/swiper/modules.js',
    '^swiper/css$': '<rootDir>/__mocks__/swiper.css',
    '^swiper/css/.*$': '<rootDir>/__mocks__/swiper.css',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!swiper).+\\.js$'
  ],
}; 
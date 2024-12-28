 export default {
    testEnvironment: 'jsdom',
    testEnvironment: 'jest-environment-jsdom',
    verbose: false,
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|webp|svg|mp4)$': '<rootDir>/__mocks__/fileMock.js', /* Maneja importaciones de archivos estáticos como imágenes y videos */
    },
  };
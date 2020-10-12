// Modified react-native/jest-preset.js
const dir = __dirname;

module.exports = {
  haste: {
    defaultPlatform: 'ios',
    platforms: ['android', 'ios', 'native'],
  },
  moduleNameMapper: {
    '^React$': require.resolve('react'),
    'react-native-cols': '<rootDir>/src'
  },
  modulePathIgnorePatterns: [
    `${dir}/Libraries/react-native/`,
    '/app/'
  ],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$': require.resolve(
      './node_modules/react-native/jest/assetFileTransformer.js',
    ),
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community)',
  ],
  setupFiles: [require.resolve('./node_modules/react-native/jest/setup.js')],
  testEnvironment: 'node',
};
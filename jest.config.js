// Modified react-native/jest-preset.js
const dir = __dirname;

module.exports = {
  haste: {
    defaultPlatform: 'ios',
    platforms: ['android', 'ios', 'native'],
    hasteImplModulePath: require.resolve('./node_modules/react-native/jest/hasteImpl.js'),
    providesModuleNodeModules: ['react-native'],
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  moduleNameMapper: {
    '^React$': require.resolve('react'),
    'react-native-cols': '<rootDir>/src'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/app/'
  ],
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
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element)',
  ],
  testMatch: [
    '**/__tests__/**/*.(js|ts|tsx)',
    '**/?(*.)+(spec|test).(js|ts|tsx)',
  ],
  setupFiles: [
    require.resolve('./node_modules/react-native/jest/setup.js')
  ],
  testEnvironment: 'node'
}

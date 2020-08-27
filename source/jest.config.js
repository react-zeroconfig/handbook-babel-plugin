const jestPresets = require('rocket-punch/jest-preset');

module.exports = {
  ...jestPresets,
  
  // customize your config
  moduleNameMapper: {
    ...jestPresets.moduleNameMapper,
    '@handbook/(.*)': '<rootDir>/src/@handbook/$1',
  },
};

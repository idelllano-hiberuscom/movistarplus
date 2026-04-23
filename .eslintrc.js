module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    // xwalk max-cells overrides for content-rich blocks (multi-field plan/hero/content cards)
    'xwalk/max-cells': ['error', {
      header: 8,
      'plan-selector-item': 12,
      'hero-carousel-item': 10,
      'content-carousel': 8,
      'content-carousel-item': 12,
    }],
  },
};

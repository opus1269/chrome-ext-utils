module.exports = {
  'extends': [
    'eslint:recommended',
    'google',
    'plugin:promise/recommended',
  ],

  'env': {
    'browser': true,
    'es6': true,
  },

  'plugins': [
    'html',
    'promise',
  ],

  'parserOptions': {
    'ecmaVersion': 2017,
    'sourceType': 'module',
  },

  'globals': {
    'chrome': true,
    'ChromePromise': true,
    'ga': true,
    'require': true,
    'exports': true,
  },

  'rules': {
    'object-curly-spacing': 'off',
    'linebreak-style': ['off', 'windows'],
    'max-len': [
      'error', {
        'code': 80,
        'tabWidth': 2,
      }],
    'eqeqeq': ['error', 'always'],
    'no-var': 'warn',
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'no-trailing-spaces': 'off',
    'padded-blocks': 'off',
    'require-jsdoc': 'off',
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent'],
    'prefer-rest-params': 'off',
  },
};

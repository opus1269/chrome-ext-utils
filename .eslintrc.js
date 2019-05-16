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
    'Chrome': true,
    'chrome': true,
    'ChromePromise': true,
    'ga': true,
    'require': true
  },

  'rules': {
    'object-curly-spacing': 'off',
    'linebreak-style': ['off', 'windows'],
    'max-len': [
      'error', {
        'code': 80,
        'tabWidth': 2,
        'ignoreComments': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
      }],
    'eqeqeq': ['error', 'always'],
    'no-var': 'warn',
    'no-console': ['warn', {'allow': ['error']}],
    'no-unused-vars': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'no-trailing-spaces': 'off',
    'padded-blocks': 'off',
    'require-jsdoc': 'warn',
    'new-cap': ['error', {'capIsNewExceptions': ['Polymer', 'If']}],
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent'],
    'prefer-rest-params': 'off',
    'valid-jsdoc': [
      'error', {
        'requireParamDescription': false,
        'requireReturnDescription': false,
        'requireReturn': false,
        'prefer': {
          'return': 'returns',
        },
      }],
  },

};

module.exports = {
  root: true,
  ignorePatterns: [
    'build/*',
    'dist/*',
  ],
  env: {
    browser: true,
    es6: true,
  },
  plugins: [
    'import',
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [ '.ts', '.tsx' ],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'comma-dangle': [
      'warn', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'eqeqeq': [
      'warn',
      'always',
    ],
    'quotes': [
      'warn',
      'single',
    ],
    'semi': [
      'warn',
      'always',
    ],
    'space-in-parens': [
      'warn',
      'always',
    ],
    'react/jsx-wrap-multilines': [
      'warn',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      },
    ],
    'react/jsx-closing-bracket-location': [
      'warn',
      'tag-aligned',
    ],
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
  overrides: [
    {
      files: [ '.eslintrc.js' ],
      env: {
        node: true,
      },
    },
    {
      files: [ '*.ts', '*.tsx' ],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        'import/no-named-as-default-member': 'off',
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': [
          'warn',
          {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            enums: 'always-multiline',
            generics: 'always-multiline',
            tuples: 'always-multiline',
            functions: 'never',
          },
        ],
        '@typescript-eslint/prefer-nullish-coalescing': [
          'warn',
          {
            ignoreConditionalTests: true,
            ignoreMixedLogicalExpressions: false,
          },
        ],
        '@typescript-eslint/strict-boolean-expressions': [
          'warn',
          {
            allowNullableObject: true,
            allowNullableString: true,
          },
        ],
        '@typescript-eslint/prefer-optional-chain': 'warn',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        '@typescript-eslint/no-inferrable-types': [
          'error',
          {
            ignoreParameters: true,
          },
        ],
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowNullish: true,
          },
        ],
      },
    },
  ],
};

module.exports = {
  overrides: [
    {
      files: [ '*.ts', '*.tsx' ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
  ],
};

declare module 'easy-control'
{
  global
  {
    const process: {
      env: {
        NODE_ENV: 'development' | 'production',
      },
    };
  }
}

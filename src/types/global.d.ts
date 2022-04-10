declare module 'easy-control'
{
  import Browser from 'webextension-polyfill';

  global
  {
    const process: {
      env: {
        NODE_ENV: 'development' | 'production',
      },
    };

    const browser = Browser;
  }
}

import type * as Browser from 'webextension-polyfill';

declare global
{
  const process: {
    env: {
      NODE_ENV: 'development' | 'production',
    },
  };

  const browser: typeof Browser;
}

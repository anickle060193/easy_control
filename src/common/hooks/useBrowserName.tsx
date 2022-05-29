import React from 'react';

import { BrowserName, getBrowserName } from '../util';

export function useBrowserName(): BrowserName
{
  const [ browserName, setBrowserName ] = React.useState<BrowserName>( 'other' );

  React.useEffect( () =>
  {
    void ( async () =>
    {
      try
      {
        setBrowserName( await getBrowserName() );
      }
      catch( e )
      {
        console.warn( 'Failed to retrieve browser name:', e );
      }
    } )();
  }, [] );

  return browserName;
}

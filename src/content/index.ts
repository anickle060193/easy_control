import Controller from './controller';
import { onReady } from './util';

import { controller as pandoraController } from './controllers/pandora';

type UrlMatch = string | RegExp | UrlMatch[];

function urlMatches( matches: UrlMatch, url: string ): boolean
{
  if( Array.isArray( matches ) )
  {
    return matches.some( ( match ) => urlMatches( match, url ) );
  }
  else if( matches instanceof RegExp )
  {
    return matches.test( url );
  }
  else
  {
    return url.includes( matches );
  }
}

interface ControllerConfig
{
  label: string;
  matches: UrlMatch;
  controller: Controller;
}

const CONTROLLERS: ControllerConfig[] = [
  {
    label: 'Pandora',
    matches: /^https:\/\/www.pandora.com(\/.*)?$/,
    controller: pandoraController,
  },
];

onReady( () =>
{
  for( const { label, matches, controller } of CONTROLLERS )
  {
    try
    {
      if( urlMatches( matches, window.location.href ) )
      {
        console.log( 'Found matching controller:', label, controller );

        controller.registerListener( () =>
        {
          console.log( 'Controller update:', label, controller.isPlaying() );
        } );

        return;
      }
    }
    catch( e )
    {
      console.error( 'Failed to match controller:', e );
    }
  }
});

import Controller from './controller';

import { ControllerId } from '../common/controllers';

import { controller as pandoraController } from './controllers/pandora';
import { controller as youtubeController } from './controllers/youtube';
import { controller as spotifyController } from './controllers/spotify';

type UrlMatch = string | RegExp | UrlMatch[];

interface ControllerConfig
{
  matches: UrlMatch;
  controller: Controller;
}

const CONTROLLERS_CONFIG: { [ key in ControllerId ]: ControllerConfig | null } = {
  [ ControllerId.Pandora ]: {
    matches: /^https:\/\/www.pandora.com(\/.*)?$/i,
    controller: pandoraController,
  },
  [ ControllerId.Youtube ]: {
    matches: /^https:\/\/www.youtube.com(\/.*)?$/i,
    controller: youtubeController,
  },
  [ ControllerId.Spotify ]: {
    matches: /^https:\/\/[^.]+.spotify.com(\/.*)?$/i,
    controller: spotifyController,
  },
  [ ControllerId.GenericAudioVideo ]: null,
};

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

export function findMatchingController(): [ ControllerId, Controller ] | null
{
  const c = Object
    .entries( CONTROLLERS_CONFIG )
    .filter( ( entry ): entry is [ ControllerId, ControllerConfig ] => entry[ 1 ] !== null )
    .find( ( [ , { matches } ] ) => urlMatches( matches, window.location.href ) );
  if( !c )
  {
    return null;
  }

  const [ controllerId, { controller } ] = c;

  return [ controllerId, controller ];
}

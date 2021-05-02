import { BackgroundMessage, BackgroundMessageId } from '../common/backgroundMessages';
import { ContentMessageId, UpdateContentMessage } from '../common/contentMessages';

import { onReady } from './util';
import { CONTROLLERS_CONFIG } from './config';
import settings from '../common/settings';
import { ControllerId, CONTROLLERS } from '../common/controllers';

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

onReady( () =>
{
  const c = Object.entries( CONTROLLERS_CONFIG ).find( ( [ , { matches } ] ) => urlMatches( matches, window.location.href ) );
  if( !c )
  {
    return;
  }

  const controllerId = c[ 0 ] as ControllerId;
  const { controller } = c[ 1 ];
  console.log( 'Found matching controller:', controllerId, controller );

  if( !settings.get( CONTROLLERS[ controllerId ].enabledSetting ) )
  {
    console.log( 'Controller is not enabled:', controllerId );
    return;
  }

  const port = chrome.runtime.connect( { name: controllerId } );
  console.log( 'Connected port for', controllerId, ':', port );

  const unregister = controller.registerListener( () =>
  {
    if( !controller.isEnabled() )
    {
      return;
    }

    const message: UpdateContentMessage = {
      id: ContentMessageId.Update,
      status: {
        playing: controller.isPlaying(),
        progress: controller.getProgress(),
      },
      media: {
        track: controller.getTrack(),
        artist: controller.getArtist(),
        album: controller.getAlbum(),
        artwork: controller.getArtwork(),
      },
    };
    port.postMessage( message );
  } );

  port.onMessage.addListener( ( message: BackgroundMessage ) =>
  {
    if( message.id === BackgroundMessageId.PlayPause )
    {
      if( controller.isPlaying() )
      {
        console.log( 'Pausing controller:', controllerId );
        controller.pause();
      }
      else
      {
        console.log( 'Playing controller:', controllerId );
        controller.play();
      }
    }
    else if( message.id === BackgroundMessageId.Play )
    {
      if( !controller.isPlaying() )
      {
        console.log( 'Playing controller:', controllerId );
        controller.play();
      }
      else
      {
        console.log( 'Controller is already playing:', controllerId );
      }
    }
    else if( message.id === BackgroundMessageId.Pause )
    {
      if( controller.isPlaying() )
      {
        console.log( 'Pausing controller:', controllerId );
        controller.pause();
      }
      else
      {
        console.log( 'Controller is already paused:', controllerId );
      }
    }
    else
    {
      console.warn( 'Unknown message:', message );
    }
  } );

  port.onDisconnect.addListener( ( p ) =>
  {
    console.log( 'Port disconnected for', controllerId, p );
    unregister();
  } );
} );

import { BackgroundMessage, BackgroundMessageId } from '../common/background_messages';
import { ContentMessageId, UpdateContentMessage } from '../common/content_messages';

import { onReady } from './util';
import CONTROLLERS from './config';

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
  const c = Object.entries( CONTROLLERS ).find( ( [ , { matches } ] ) => urlMatches( matches, window.location.href ) );
  if( !c )
  {
    return;
  }

  const [ controllerId, { label, controller } ] = c;
  console.log( 'Found matching controller:', label, controller );

  const port = chrome.runtime.connect( { name: controllerId } );
  console.log( 'Connected port for', label, ':', port );

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
        console.log( 'Pausing controller:', label );
        controller.pause();
      }
      else
      {
        console.log( 'Playing controller:', label );
        controller.play();
      }
    }
    else if( message.id === BackgroundMessageId.Play )
    {
      if( !controller.isPlaying() )
      {
        console.log( 'Playing controller:', label );
        controller.play();
      }
      else
      {
        console.log( 'Controller is already playing:', label );
      }
    }
    else if( message.id === BackgroundMessageId.Pause )
    {
      if( controller.isPlaying() )
      {
        console.log( 'Pausing controller:', label );
        controller.pause();
      }
      else
      {
        console.log( 'Controller is already paused:', label );
      }
    }
    else
    {
      console.warn( 'Unknown message:', message );
    }
  } );

  port.onDisconnect.addListener( ( p ) =>
  {
    console.log( 'Port disconnected for', label, p );
    unregister();
  } );
} );

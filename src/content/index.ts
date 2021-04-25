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
  const c = CONTROLLERS.find( ( { matches } ) => urlMatches( matches, window.location.href ) );
  if( !c )
  {
    return;
  }

  const { label, controller } = c;
  console.log( 'Found matching controller:', label, controller );

  const port = chrome.runtime.connect( { name: label } );
  console.log( 'Connected port for', label, ':', port );

  const unregister = controller.registerListener( () =>
  {
    const message: UpdateContentMessage = {
      id: ContentMessageId.Update,
      mediaInfo: {
        playing: controller.isPlaying(),
        track: controller.getTrack(),
        artist: controller.getArtist(),
        album: controller.getAlbum(),
        artwork: controller.getArtwork(),
        progress: controller.getProgress(),
      },
    };
    port.postMessage( message );
  } );

  port.onMessage.addListener( ( message: BackgroundMessage ) =>
  {
    if( message.id === BackgroundMessageId.Pause )
    {
      console.log( 'Pausing', label );
      controller.pause();
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

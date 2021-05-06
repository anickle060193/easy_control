import { BackgroundMessage, BackgroundMessageId } from '../common/backgroundMessages';
import { ContentMessageId, UpdateContentMessage } from '../common/contentMessages';
import settings from '../common/settings';
import { ControllerCommand, ControllerId, CONTROLLERS, DEFAULT_CONTROLLER_CAPABILITIES, DEFAULT_CONTROLLER_MEDIA, DEFAULT_CONTROLLER_STATUS } from '../common/controllers';

import { CONTROLLERS_CONFIG } from './config';
import { onReady } from './util';
import { removeDebugIndication, updateDebugIndication } from './DebugControllerData';

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
    let message: UpdateContentMessage;

    if( !controller.isEnabled() )
    {
      message = {
        id: ContentMessageId.Update,
        status: DEFAULT_CONTROLLER_STATUS,
        mediaChangedIndication: null,
        media: DEFAULT_CONTROLLER_MEDIA,
        capabilities: DEFAULT_CONTROLLER_CAPABILITIES,
      };
    }
    else
    {
      const indication = controller.getMediaChangedIndication();
      let mediaChangedIndication: string | null;
      if( indication.some( ( s ) => typeof s !== 'string' ) )
      {
        mediaChangedIndication = null;
      }
      else
      {
        mediaChangedIndication = indication.join( '::' );
      }

      message = {
        id: ContentMessageId.Update,
        status: {
          enabled: true,
          playing: controller.isPlaying(),
          progress: controller.getProgress(),
          volume: controller.getVolume(),
        },
        mediaChangedIndication,
        media: {
          track: controller.getTrack(),
          artist: controller.getArtist(),
          album: controller.getAlbum(),
          artwork: controller.getArtwork(),
          liked: controller.isLiked(),
          disliked: controller.isDisliked(),
        },
        capabilities: {
          next: controller.canNext(),
          previous: controller.canPrevious(),
          skipBackward: controller.canSkipBackward(),
          skipForward: controller.canSkipForward(),
          like: controller.canLike(),
          unlike: controller.canUnlike(),
          dislike: controller.canDislike(),
          undislike: controller.canUndislike(),
          volume: controller.canVolume(),
        },
      };
    }

    port.postMessage( message );

    updateDebugIndication( controllerId, message );
  } );

  port.onMessage.addListener( ( message: BackgroundMessage ) =>
  {
    if( message.id === BackgroundMessageId.Command )
    {
      if( message.command === ControllerCommand.PlayPause )
      {
        if( controller.isPlaying() )
        {
          console.log( 'Pausing controller:', controllerId );
          controller.performPause();
        }
        else
        {
          console.log( 'Playing controller:', controllerId );
          controller.performPlay();
        }
      }
      else if( message.command === ControllerCommand.Play )
      {
        if( !controller.isPlaying() )
        {
          console.log( 'Playing controller:', controllerId );
          controller.performPlay();
        }
        else
        {
          console.log( 'Controller is already playing:', controllerId );
        }
      }
      else if( message.command === ControllerCommand.Pause )
      {
        if( controller.isPlaying() )
        {
          console.log( 'Pausing controller:', controllerId );
          controller.performPause();
        }
        else
        {
          console.log( 'Controller is already paused:', controllerId );
        }
      }
      else if( message.command === ControllerCommand.Next )
      {
        controller.performNext();
      }
      else if( message.command === ControllerCommand.Previous )
      {
        controller.performPrevious();
      }
      else if( message.command === ControllerCommand.SkipBackward )
      {
        controller.performSkipBackward();
      }
      else if( message.command === ControllerCommand.SkipForward )
      {
        controller.performSkipForward();
      }
      else if( message.command === ControllerCommand.Like )
      {
        controller.performLike();
      }
      else if( message.command === ControllerCommand.Unlike )
      {
        controller.performUnlike();
      }
      else if( message.command === ControllerCommand.Dislike )
      {
        controller.performDislike();
      }
      else if( message.command === ControllerCommand.Undislike )
      {
        controller.performUndislike();
      }
      else if( message.command === ControllerCommand.VolumeUp )
      {
        controller.performVolumeUp();
      }
      else if( message.command === ControllerCommand.VolumeDown )
      {
        controller.performVolumeDown();
      }
      else
      {
        console.warn( 'Unhandled controller command:', message.command, message );
      }
    }
    else
    {
      console.warn( 'Unhandled message:', message );
    }
  } );

  port.onDisconnect.addListener( ( p ) =>
  {
    console.log( 'Port disconnected for', controllerId, p );
    unregister();

    removeDebugIndication();
  } );
} );

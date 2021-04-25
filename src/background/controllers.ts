import { BackgroundMessage, BackgroundMessageId } from '../common/background_messages';
import { ContentMessage, ContentMessageId } from '../common/content_messages';
import { MediaInfo } from '../common/controllers';

interface Controller
{
  name: string;
  port: chrome.runtime.Port;
  mediaInfo: MediaInfo;
}

const controllers: { [ id: string ]: Controller | undefined } = {};

function getController( port: chrome.runtime.Port ): Controller
{
  let controller = controllers[ port.name ];
  if( !controller )
  {
    controllers[ port.name ] = controller = {
      name: port.name,
      port: port,
      mediaInfo: {
        playing: false,
        track: null,
        artist: null,
        album: null,
        artwork: null,
        progress: 0,
      },
    };
  }
  return controller;
}

export default (): void =>
{
  chrome.runtime.onConnect.addListener( ( port ) =>
  {
    console.log( 'Port connected:', port.name, port );

    const controller = getController( port );

    port.onMessage.addListener( ( message: ContentMessage ) =>
    {
      if( message.id === ContentMessageId.Update )
      {
        console.log( 'Media Update:', port.name, message );

        const startedPlaying = ( message.mediaInfo.playing && !controller.mediaInfo.playing );
        const mediaChanged = (
          controller.mediaInfo.track !== message.mediaInfo.track
        || controller.mediaInfo.artist !== message.mediaInfo.artist
        || controller.mediaInfo.album !== message.mediaInfo.album
        || controller.mediaInfo.artwork !== message.mediaInfo.artwork
        );

        if( startedPlaying )
        {
          console.log( 'Controller started playing:', controller );

          const pauseMessage: BackgroundMessage = {
            id: BackgroundMessageId.Pause,
          };

          for( const c of Object.values( controllers ) )
          {
            if( c && c !== controller )
            {
              c.port.postMessage( pauseMessage );
            }
          }
        }

        if( mediaChanged
        && message.mediaInfo.track
        && message.mediaInfo
        && message.mediaInfo.artwork )
        {
          chrome.notifications.create( {
            type: 'basic',
            silent: true,
            title: message.mediaInfo.track,
            message: message.mediaInfo.artist ?? undefined,
            contextMessage: message.mediaInfo.album ?? undefined,
            iconUrl: message.mediaInfo.artwork,
          } );
        }

        controller.mediaInfo = {
          ...message.mediaInfo,
        };
      }
      else
      {
        console.warn( 'Unknown message:', message );
      }
    } );

    port.onDisconnect.addListener( () =>
    {
      console.log( 'Controller disconnected:', controller.name, controller );
      delete controllers[ port.name ];
    } );
  } );
};

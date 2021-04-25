import { updateBrowserActionIcon } from './browserAction';
import { BackgroundController } from './controller';

import { BackgroundMessage, BackgroundMessageId } from '../common/background_messages';
import { ContentMessage, ContentMessageId } from '../common/content_messages';

const controllers: BackgroundController[] = [];

export function getCurrentController(): BackgroundController | null
{
  return controllers[ controllers.length - 1 ] ?? null;
}

export default (): void =>
{
  chrome.runtime.onConnect.addListener( ( port ) =>
  {
    console.log( 'Port connected:', port.name, port );

    const controller = new BackgroundController( port );

    controllers.push( controller );

    port.onMessage.addListener( ( message: ContentMessage ) =>
    {
      if( message.id === ContentMessageId.Update )
      {
        const previousCurrentController = getCurrentController();

        const startedPlaying = ( message.mediaInfo.playing && !controller.mediaInfo.playing );
        const mediaChanged = (
          controller.mediaInfo.track !== message.mediaInfo.track
        || controller.mediaInfo.artist !== message.mediaInfo.artist
        || controller.mediaInfo.album !== message.mediaInfo.album
        || controller.mediaInfo.artwork !== message.mediaInfo.artwork
        );

        if( startedPlaying )
        {
          console.log( 'Controller started playing:', controller.name, controller, message );

          const index = controllers.indexOf( controller );
          if( index >= 0 )
          {
            controllers.splice( index, 1 );
          }
          controllers.push( controller );

          const pauseMessage: BackgroundMessage = {
            id: BackgroundMessageId.Pause,
          };

          for( const c of controllers )
          {
            if( c && c !== controller )
            {
              c.port.postMessage( pauseMessage );
            }
          }
        }

        if( mediaChanged
        && message.mediaInfo.track
        && message.mediaInfo.artwork )
        {
          console.log( 'Media changed:', controller.name, controller  , message );
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

        const currentController = getCurrentController();
        if( controller === currentController
        || currentController !== previousCurrentController )
        {
          updateBrowserActionIcon();
        }
      }
      else
      {
        console.warn( 'Unknown message:', controller.name, message );
      }
    } );

    port.onDisconnect.addListener( () =>
    {
      console.log( 'Controller disconnected:', controller.name, controller );
      const index = controllers.indexOf( controller );
      if( index >= 0 )
      {
        controllers.splice( index, 1 );
      }
      else
      {
        console.warn( 'Failed to remove disconnected port:', controller.name, controller );
      }
    } );
  } );
};

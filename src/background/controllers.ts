import { BackgroundMessage, BackgroundMessageId } from '../common/background_messages';
import { ContentMessage, ContentMessageId } from '../common/content_messages';

interface Controller
{
  name: string;
  port: chrome.runtime.Port;
  playing: boolean;
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
      playing: false,
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
        if( message.playing && !controller.playing )
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

        controller.playing = message.playing;
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

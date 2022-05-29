import { getCurrentController } from './controllers';

import { BackgroundMessageId, UpdateBackgroundMessage } from '../common/backgroundMessages';
import settings, { SettingKey } from '../common/settings';
import { DEFAULT_CONTROLLER_CAPABILITIES, DEFAULT_CONTROLLER_MEDIA, DEFAULT_CONTROLLER_STATUS } from '../common/controllers';
import { ControlsPopupMessage, ControlsPopupMessageId } from '../common/controlsPopupMessages';
import { getBrowserName } from '../common/util';

let controlsPopupWindowId: number | null = null;
let controlsPort: browser.Runtime.Port | null = null;

export async function openControlsPopup(): Promise<void>
{
  if( typeof controlsPopupWindowId === 'number' )
  {
    try
    {
      await browser.windows.update( controlsPopupWindowId, { focused: true } );
      return;
    }
    catch( e )
    {
      console.warn( 'Failed to focus existing controls popup:', e );
      controlsPopupWindowId = null;
    }
  }

  try
  {
    const popupOptions: browser.Windows.CreateCreateDataType = {
      url: browser.runtime.getURL( 'controlsPopup.html' ),
      type: 'popup',
      focused: true,
      width: settings.get( SettingKey.Other.ControlsPopupWidth ),
      height: settings.get( SettingKey.Other.ControlsPopupHeight ),
    };

    if( await getBrowserName() === 'firefox' )
    {
      popupOptions.allowScriptsToClose = true;
    }

    const w = await browser.windows.create( popupOptions );

    controlsPopupWindowId = w.id ?? null;
  }
  catch( e )
  {
    console.error( 'Failed to open controls popup:', e );
  }
}

export function updateControlsPopup(): void
{
  if( !controlsPort )
  {
    return;
  }

  const currentController = getCurrentController();

  const message: UpdateBackgroundMessage = {
    id: BackgroundMessageId.Update,
    status: currentController?.status ?? DEFAULT_CONTROLLER_STATUS,
    media: currentController?.media ?? DEFAULT_CONTROLLER_MEDIA,
    capabilities: currentController?.capabilities ?? DEFAULT_CONTROLLER_CAPABILITIES,
  };
  controlsPort.postMessage( message );
}

export function initControlsPopup(): void
{
  const controlsPopupUrl = browser.runtime.getURL( 'controlsPopup.html' );

  browser.runtime.onMessage.addListener( ( message: ControlsPopupMessage, sender ) =>
  {
    console.log( 'Message:', message, sender );

    if( sender.tab?.url !== controlsPopupUrl )
    {
      return;
    }

    if( message.id === ControlsPopupMessageId.Loaded )
    {
      updateControlsPopup();
    }
    else if( message.id === ControlsPopupMessageId.Command )
    {
      const currentController = getCurrentController();
      if( !currentController )
      {
        console.warn( 'No controller to handle controls popup command:', message );
        return;
      }

      currentController.sendCommand( message.command );
    }
  } );

  browser.runtime.onConnect.addListener( ( port ) =>
  {
    if( port.name !== 'controls-popup'
      || port.sender?.url !== controlsPopupUrl )
    {
      return;
    }

    controlsPort?.disconnect();

    controlsPort = port;

    port.onMessage.addListener( ( message: ControlsPopupMessage ) =>
    {
      console.log( 'Message:', message );

      if( message.id === ControlsPopupMessageId.Loaded )
      {
        updateControlsPopup();
      }
      else if( message.id === ControlsPopupMessageId.Command )
      {
        const currentController = getCurrentController();
        if( !currentController )
        {
          console.warn( 'No controller to handle controls popup command:', message );
          return;
        }

        currentController.sendCommand( message.command );
      }
    } );

    port.onDisconnect.addListener( () =>
    {
      console.log( 'Controls Popup port disconnected.' );
      if( controlsPort === port )
      {
        controlsPort = null;
      }
    } );
  } );

  browser.windows.onRemoved.addListener( ( windowId ) =>
  {
    if( controlsPopupWindowId === windowId )
    {
      console.log( 'Controls popup window has closed.' );
      controlsPopupWindowId = null;
      controlsPort = null;
    }
  } );
}

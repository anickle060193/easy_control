import { getCurrentController } from './controllers';

import { BackgroundMessageId, UpdateBackgroundMessage } from '../common/backgroundMessages';
import settings, { SettingKey } from '../common/settings';
import { DEFAULT_CONTROLLER_CAPABILITIES, DEFAULT_CONTROLLER_MEDIA, DEFAULT_CONTROLLER_STATUS } from '../common/controllers';
import { ControlsPopupMessage, ControlsPopupMessageId } from '../common/controlsPopupMessages';

let controlsPopupWindow: Window | null = null;

export function openControlsPopup(): void
{
  if( controlsPopupWindow
    && !controlsPopupWindow.closed )
  {
    controlsPopupWindow.focus();
    return;
  }

  try
  {
    const windowFeatures = Object.entries( {
      width: settings.get( SettingKey.Other.ControlsPopupWidth ),
      height: settings.get( SettingKey.Other.ControlsPopupHeight ),
      dialog: 'yes',
      minimizable: 'no',
      maximizable: 'no',
      resizable: 'no',
      scrollbars: 'no',
    } ).map( ( [ key, value ] ) => `${key}=${value}` ).join( ',' );
    controlsPopupWindow = window.open( chrome.runtime.getURL( 'controlsPopup.html' ), 'easy-control--controls-popup', windowFeatures );

    if( !controlsPopupWindow )
    {
      throw new Error( 'Unable to open window' );
    }

    controlsPopupWindow.focus();
  }
  catch( e )
  {
    console.error( 'Failed to open controls popup:', e );
  }
}

export function updateControlsPopup(): void
{
  if( !controlsPopupWindow )
  {
    return;
  }
  else if( controlsPopupWindow.closed )
  {
    console.warn( 'Controls Popup Window was closed.' );
    controlsPopupWindow = null;
    return;
  }

  const currentController = getCurrentController();

  const message: UpdateBackgroundMessage = {
    id: BackgroundMessageId.Update,
    status: currentController?.status ?? DEFAULT_CONTROLLER_STATUS,
    media: currentController?.media ?? DEFAULT_CONTROLLER_MEDIA,
    capabilities: currentController?.capabilities ?? DEFAULT_CONTROLLER_CAPABILITIES,
  };
  controlsPopupWindow.postMessage( message, chrome.runtime.getURL( 'controlsPopup.html' ) );
}

export function initControlsPopup(): void
{
  chrome.runtime.onMessage.addListener( ( message: ControlsPopupMessage, sender ) =>
  {
    console.log( 'Message:', message, sender );

    if( sender.tab?.url !== chrome.runtime.getURL( 'controlsPopup.html' ) )
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

  chrome.windows.onRemoved.addListener( () =>
  {
    if( controlsPopupWindow?.closed === true )
    {
      console.log( 'Controls popup window has closed.' );
      controlsPopupWindow = null;
    }
  } );
}

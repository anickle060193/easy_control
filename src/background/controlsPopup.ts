import
{
  pauseCurrentController,
  playCurrentController,
  nextCurrentController,
  previousCurrentController,
  likeCurrentController,
  unlikeCurrentController,
  dislikeCurrentController,
  undislikeCurrentController,
  volumeUpCurrentController,
  volumeDownCurrentController
} from 'background/controllers';

import { ControlsPopupUpdateData, createControlsPopupUpdateMessage, MessageTypes, Message } from 'common/message';
import { settings, SettingKey } from 'common/settings';

let controlsPopup: Window | null = null;

export function openControlsPopup()
{
  if( controlsPopup === null
    || controlsPopup.closed )
  {
    let windowFeatures = Object.entries( {
      width: settings.get( SettingKey.Other.ControlsPopupWidth ),
      height: settings.get( SettingKey.Other.ControlsPopupHeight ),
      dialog: 'yes',
      minimizable: 'yes',
      resizable: 'no',
      scrollbars: 'no',
    } ).map( ( [ key, value ] ) => `${key}=${value}` ).join( ',' );
    console.log( 'WINDOW FEATURES:', windowFeatures );
    controlsPopup = window.open( chrome.runtime.getURL( 'controlsPopup.html' ), 'easy-control--controls-popup', windowFeatures );
  }
  else
  {
    controlsPopup.focus();
  }
}

export function updateControlsPopup( data: ControlsPopupUpdateData | null )
{
  chrome.runtime.sendMessage( createControlsPopupUpdateMessage( data ) );
}

chrome.runtime.onMessage.addListener( ( message: Message ) =>
{
  if( message.type === MessageTypes.FromControlsPopup.Pause )
  {
    console.log( 'Controller Popup Message:', message.type );
    pauseCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.Play )
  {
    console.log( 'Controller Popup Message:', message.type );
    playCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.Next )
  {
    console.log( 'Controller Popup Message:', message.type );
    nextCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.Previous )
  {
    console.log( 'Controller Popup Message:', message.type );
    previousCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.Like )
  {
    console.log( 'Controller Popup Message:', message.type );
    likeCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.Unlike )
  {
    console.log( 'Controller Popup Message:', message.type );
    unlikeCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.Dislike )
  {
    console.log( 'Controller Popup Message:', message.type );
    dislikeCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.Undislike )
  {
    console.log( 'Controller Popup Message:', message.type );
    undislikeCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.VolumeUp )
  {
    console.log( 'Controller Popup Message:', message.type );
    volumeUpCurrentController();
  }
  else if( message.type === MessageTypes.FromControlsPopup.VolumeDown )
  {
    console.log( 'Controller Popup Message:', message.type );
    volumeDownCurrentController();
  }
} );

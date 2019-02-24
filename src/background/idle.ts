import { getCurrentController } from 'background/controllers';

import { settings, SettingKey } from 'common/settings';

chrome.idle.onStateChanged.addListener( ( newState ) =>
{
  console.log( 'State Changed:', newState );

  let currentController = getCurrentController();

  if( currentController && !currentController.paused )
  {
    if( newState === 'locked' )
    {
      if( settings.get( SettingKey.Other.PauseOnLock ) )
      {
        console.log( 'Pausing due to Lock' );
        currentController.pause();
      }
    }
    else if( newState === 'idle' )
    {
      if( settings.get( SettingKey.Other.PauseOnInactivity )
        && currentController.allowPauseOnInactivity )
      {
        console.log( 'Pausing due to Inactivity' );
        currentController.pause();
      }
    }
  }
} );

settings.initialize( () =>
{
  chrome.idle.setDetectionInterval( settings.get( SettingKey.Other.InactivityTimeout ) );
} );

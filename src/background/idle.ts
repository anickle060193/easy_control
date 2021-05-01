import { BackgroundMessageId } from '../common/background_messages';
import settings, { SettingKey } from '../common/settings';

import { getCurrentController } from './controllers';

export function initIdle(): void
{
  function onSettingsChange()
  {
    chrome.idle.setDetectionInterval( settings.get( SettingKey.Other.InactivityTimeout ) );
  }

  settings.onInitialized.addEventListener( onSettingsChange );
  settings.onChanged.addEventListener( onSettingsChange );

  chrome.idle.onStateChanged.addListener( ( newState ) =>
  {
    if( newState === 'locked' )
    {
      console.log( 'Computer Locked' );

      if( settings.get( SettingKey.Other.PauseOnLock ) )
      {
        getCurrentController()?.sendMessage( BackgroundMessageId.Pause );
      }
    }
    else if( newState === 'idle' )
    {
      console.log( 'Computer Inactive' );

      if( settings.get( SettingKey.Other.PauseOnInactivity ) )
      {
        getCurrentController()?.sendMessage( BackgroundMessageId.Pause );
      }
    }
  } );
}

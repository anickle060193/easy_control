import browser from 'webextension-polyfill';

import { ControllerCommand } from '../common/controllers';
import settings, { SettingKey } from '../common/settings';

import { getCurrentController } from './controllers';

export function initIdle(): void
{
  function onSettingsChange()
  {
    browser.idle.setDetectionInterval( settings.get( SettingKey.Other.InactivityTimeout ) );
  }

  settings.onInitialized.addEventListener( onSettingsChange );
  settings.onChanged.addEventListener( onSettingsChange );

  browser.idle.onStateChanged.addListener( ( newState ) =>
  {
    if( newState === 'locked' )
    {
      console.log( 'Computer Locked' );

      if( settings.get( SettingKey.Other.PauseOnLock ) )
      {
        getCurrentController()?.sendCommand( ControllerCommand.Pause );
      }
    }
    else if( newState === 'idle' )
    {
      console.log( 'Computer Inactive' );

      if( settings.get( SettingKey.Other.PauseOnInactivity ) )
      {
        getCurrentController()?.sendCommand( ControllerCommand.Pause );
      }
    }
  } );
}

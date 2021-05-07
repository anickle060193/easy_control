import { initContextMenus } from './contextMenus';
import { initCommands } from './commands';
import { initBrowserAction } from './browserAction';
import { initIdle } from './idle';
import { initControllers } from './controllers';
import { initNotifications } from './notifications';
import { initControlsPopup } from './controlsPopup';

chrome.runtime.onInstalled.addListener( ( details ) =>
{
  const version = chrome.runtime.getManifest().version;

  if( details.reason === 'install' )
  {
    console.log( 'Installed:', version );
  }
  else if( details.reason === 'update' )
  {
    console.log( 'Updated:', details.previousVersion, '->', version );
  }
  else
  {
    console.log( 'Unknown Install Reason:', details );
  }
} );

initContextMenus();
initCommands();
initBrowserAction();
initNotifications();
initIdle();
initControlsPopup();
initControllers();

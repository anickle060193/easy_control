import { getControllers } from 'background/controllers';
import { focusTab } from 'background/utilities';

import { settings, SettingKey } from 'common/settings';

const tabs: { [ id: number ]: string | undefined } = {};

function onTabUpdated( tab: chrome.tabs.Tab )
{
  if( !tab.id )
  {
    console.warn( 'Tab has no ID:', tab );
    return;
  }
  else if( !tab.url )
  {
    console.warn( 'Tab does not have a URL:', tab );
    return;
  }

  let hostname = new URL( tab.url ).hostname;
  if( hostname )
  {
    for( let controller of getControllers() )
    {
      if( !controller.port.sender || !controller.port.sender.tab || !controller.port.sender.tab.id )
      {
        console.warn( 'Controller port has no sender:', controller.port.sender );
        continue;
      }

      if( controller.port.sender.tab.id !== tab.id
        && controller.hostname
        && hostname.includes( controller.hostname )
        && settings.get( SettingKey.OpenInExisting[ controller.name ] ) )
      {
        console.log( 'Already have', controller.name, 'controller.' );
        chrome.tabs.remove( tab.id );

        let existingTab = controller.port.sender.tab;

        focusTab( existingTab );

        controller.openContentLink( tab.url );

        break;
      }
    }
  }
}

chrome.tabs.onCreated.addListener( ( tab ) =>
{
  if( !tab.id )
  {
    console.warn( 'Tab does not have an ID:', tab );
    return;
  }

  tabs[ tab.id ] = tab.url;
  if( tab.url )
  {
    onTabUpdated( tab );
  }
} );

chrome.tabs.onUpdated.addListener( ( tabId, changeInfo, tab ) =>
{
  if( !tab.url )
  {
    console.warn( 'Tab does not have URL:', tabId, tab );
    return;
  }

  if( typeof changeInfo.url !== 'undefined' )
  {
    if( tabs[ tabId ] !== tab.url )
    {
      onTabUpdated( tab );
      tabs[ tabId ] = tab.url;
    }
  }
} );

chrome.tabs.onRemoved.addListener( ( tabId, removeInfo ) =>
{
  delete tabs[ tabId ];
} );

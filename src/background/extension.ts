import settings, { SettingKey } from '../common/settings';

export function initExtension(): void
{
  chrome.runtime.onInstalled.addListener( ( details ) =>
  {
    const version = chrome.runtime.getManifest().version;

    let possiblyShowChangelog = false;
    if( details.reason === 'install' )
    {
      console.log( 'Installed:', version );
    }
    else if( details.reason === 'update' )
    {
      console.log( 'Updated:', details.previousVersion, '->', version );
      possiblyShowChangelog = true;
    }
    else
    {
      console.log( 'Unknown Install Reason:', details );
    }

    if( possiblyShowChangelog )
    {
      settings.onInitialized.addEventListener( () =>
      {
        if( settings.get( SettingKey.Other.ShowChangeLogOnUpdate ) )
        {
          chrome.tabs.create( {
            url: chrome.runtime.getURL( 'changelog.html' ),
          }, () =>
          {
            if( chrome.runtime.lastError )
            {
              console.warn( 'Failed to create tab for changelog:', chrome.runtime.lastError );
            }
          } );
        }
      } );
    }
  } );
}

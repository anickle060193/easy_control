import settings, { SettingKey } from '../common/settings';

export function initExtension(): void
{
  browser.runtime.onInstalled.addListener( ( details ) =>
  {
    const version = browser.runtime.getManifest().version;

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
      settings.onInitialized.addEventListener( async () =>
      {
        if( settings.get( SettingKey.Other.ShowChangeLogOnUpdate ) )
        {
          try
          {
            await browser.tabs.create( {
              url: browser.runtime.getURL( 'changelog.html' ),
            } );
          }
          catch( e )
          {
            console.warn( 'Failed to create tab for changelog:', e );
          }
        }
      } );
    }
  } );
}

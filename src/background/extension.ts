import settings, { SettingKey } from '../common/settings';

const LAST_EXTENSION_VERSION_STORAGE_KEY = 'last_extension_version';

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
            const data = await browser.storage.local.get( LAST_EXTENSION_VERSION_STORAGE_KEY );
            const lastVersion: unknown = data[ LAST_EXTENSION_VERSION_STORAGE_KEY ];
            if( lastVersion !== version )
            {
              await browser.tabs.create( {
                url: browser.runtime.getURL( 'changelog.html' ),
              } );
            }
          }
          catch( e )
          {
            console.warn( 'Failed to create tab for changelog:', e );
          }
        }

        await browser.storage.local.set( { [ LAST_EXTENSION_VERSION_STORAGE_KEY ]: version } );
      } );
    }
  } );
}

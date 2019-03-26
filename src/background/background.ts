import { settings, SettingKey } from 'common/settings';

chrome.runtime.onInstalled.addListener( async ( details ) =>
{
  let version = chrome.runtime.getManifest().version;

  let possiblyShowChangelog = false;
  if( details.reason === 'install' )
  {
    console.log( 'Installing version ' + version );
  }
  else if( details.reason === 'update' )
  {
    console.log( 'Updating to version ' + version );
    possiblyShowChangelog = ( version !== details.previousVersion );
  }
  else
  {
    console.log( 'Not installing or updating:' );
    console.log( details );
  }

  await settings.initialize();

  if( possiblyShowChangelog
    && settings.get( SettingKey.Other.ShowChangeLogOnUpdate ) )
  {
    chrome.tabs.create( { url: chrome.runtime.getURL( 'changelog.html' ) } );
  }

} );

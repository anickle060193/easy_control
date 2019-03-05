import { setAutoPauseEnabledForTab, isAutoPauseEnabledForTab } from 'background/autoPauser';
import { openControlsPopup } from 'background/controlsPopup';

import { settings, SettingKey } from 'common/settings';

const enum ContextMenu
{
  ReloadExtension = 'reload_extension',
  AutoPauseEnabled = 'auto_pause_enabled',
  AutoPausedEnabledForTab = 'auto_pause_enabled_for_tab',
  OpenControls = 'open_controls',
}

if( process.env.NODE_ENV === 'development' )
{
  chrome.contextMenus.create( {
    id: ContextMenu.ReloadExtension,
    title: 'Reload Extension',
    contexts: [ 'browser_action' ],
  } );
}

chrome.contextMenus.create( {
  type: 'checkbox',
  id: ContextMenu.AutoPauseEnabled,
  title: 'Auto-Pause Enabled',
  checked: true,
  contexts: [ 'browser_action' ],
} );

chrome.contextMenus.create( {
  type: 'checkbox',
  id: ContextMenu.AutoPausedEnabledForTab,
  title: 'Auto-Pause Enabled for Tab',
  checked: true,
  contexts: [ 'browser_action' ],
} );

chrome.contextMenus.create( {
  type: 'normal',
  id: ContextMenu.OpenControls,
  title: 'Open Controls',
  contexts: [ 'browser_action' ],
} );

settings.initialize( () =>
{
  chrome.contextMenus.update( ContextMenu.AutoPauseEnabled, {
    checked: settings.get( SettingKey.Other.AutoPauseEnabled )
  } );
} );

chrome.contextMenus.onClicked.addListener( ( info, tab ) =>
{
  if( info.menuItemId === ContextMenu.ReloadExtension )
  {
    chrome.runtime.reload();
  }
  else if( info.menuItemId === ContextMenu.AutoPauseEnabled )
  {
    console.log( 'Auto-Pause Enabled:', info.checked );
    settings.set( SettingKey.Other.AutoPauseEnabled, !!info.checked );
  }
  else if( info.menuItemId === ContextMenu.AutoPausedEnabledForTab )
  {
    console.log( 'Auto-Pause Enabled for Tab: Tab -', tab!.id, ':', info.checked );
    setAutoPauseEnabledForTab( tab!.id!, !!info.checked );
  }
  else if( info.menuItemId === ContextMenu.OpenControls )
  {
    openControlsPopup();
  }
  else
  {
    console.warn( 'Unknown context menu:', info );
  }
} );

chrome.tabs.onActivated.addListener( ( activateInfo ) =>
{
  chrome.contextMenus.update( ContextMenu.AutoPausedEnabledForTab, {
    checked: isAutoPauseEnabledForTab( activateInfo.tabId )
  } );
} );

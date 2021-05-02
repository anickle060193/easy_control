import { isAutoPauseEnabledForTab, setAutoPauseEnabledForTab } from './autoPause';

import settings, { SettingKey } from '../common/settings';

enum ContextMenuId
{
  ReloadExtension = 'context_menu__reload_extension',
  AutoPauseEnabled = 'context_menu__auto_pause_enabled',
  AutoPauseEnabledForTab = 'context_menu__auto_pause_enabled_for_tab',
}

export function initContextMenus(): void
{
  chrome.runtime.onInstalled.addListener( () =>
  {
    if( process.env.NODE_ENV === 'development' )
    {
      chrome.contextMenus.create( {
        id: ContextMenuId.ReloadExtension,
        title: 'Reload Extension',
        contexts: [ 'browser_action' ],
      }, () =>
      {
        if( chrome.runtime.lastError )
        {
          console.error( 'Failed to create "Reload Extension" context menu:', chrome.runtime.lastError );
        }
      } );
    }

    chrome.contextMenus.create( {
      id: ContextMenuId.AutoPauseEnabled,
      type: 'checkbox',
      title: 'Auto-Pause Enabled',
      checked: settings.get( SettingKey.Other.AutoPauseEnabled ),
      contexts: [ 'browser_action' ],
    }, () =>
    {
      if( chrome.runtime.lastError )
      {
        console.error( 'Failed to create "Auto-Pause Enabled" context menu:', chrome.runtime.lastError );
      }
    } );

    chrome.contextMenus.create( {
      id: ContextMenuId.AutoPauseEnabledForTab,
      type: 'checkbox',
      title: 'Auto-Pause Enabled for Tab',
      checked: true,
      contexts: [ 'browser_action' ],
    }, () =>
    {
      if( chrome.runtime.lastError )
      {
        console.error( 'Failed to create "Auto-Pause Enabled for Tab" context menu:', chrome.runtime.lastError );
      }
    } );

    function onSettingsChanged()
    {
      chrome.contextMenus.update( ContextMenuId.AutoPauseEnabled, {
        checked: settings.get( SettingKey.Other.AutoPauseEnabled ),
      } );
    }

    settings.onInitialized.addEventListener( onSettingsChanged );
    settings.onChanged.addEventListener( onSettingsChanged );
  } );

  chrome.contextMenus.onClicked.addListener( ( info, tab ) =>
  {
    if( info.menuItemId === ContextMenuId.ReloadExtension )
    {
      chrome.runtime.reload();
    }
    else if( info.menuItemId === ContextMenuId.AutoPauseEnabled )
    {
      console.log( 'Auto-Pause Enabled:', info.checked );
      settings.set( SettingKey.Other.AutoPauseEnabled, info.checked ?? true );
    }
    else if( info.menuItemId === ContextMenuId.AutoPauseEnabledForTab )
    {
      if( typeof tab?.id !== 'number' )
      {
        console.warn( 'Could not toggle auto-pause enabled for tab with no ID:', info, tab );
      }
      else
      {
        console.log( 'Toggle auto-pause for tab:', info, tab );
        setAutoPauseEnabledForTab( tab.id, info.checked ?? true );
      }
    }
    else
    {
      console.warn( 'Unhandled context menu item:', info );
    }
  } );

  chrome.tabs.onActivated.addListener( ( activeTab ) =>
  {
    chrome.contextMenus.update( ContextMenuId.AutoPauseEnabledForTab, {
      checked: isAutoPauseEnabledForTab( activeTab.tabId ),
    } );
  } );
}

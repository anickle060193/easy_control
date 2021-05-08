import settings, { SettingKey } from '../common/settings';

import { isAutoPauseEnabledForTab, setAutoPauseEnabledForTab } from './autoPause';
import { openControlsPopup } from './controlsPopup';

enum ContextMenuId
{
  ReloadExtension = 'context_menu__reload_extension',
  AutoPauseEnabled = 'context_menu__auto_pause_enabled',
  AutoPauseEnabledForTab = 'context_menu__auto_pause_enabled_for_tab',
  OpenControls = 'context_menu__open_controls',
}

export function initContextMenus(): void
{
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
    else if( info.menuItemId === ContextMenuId.OpenControls )
    {
      openControlsPopup();
    }
    else
    {
      console.warn( 'Unhandled context menu item:', info );
    }
  } );

  chrome.contextMenus.removeAll( () =>
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

    chrome.contextMenus.create( {
      id: ContextMenuId.OpenControls,
      title: 'Open Controls',
      contexts: [ 'browser_action' ],
    }, () =>
    {
      if( chrome.runtime.lastError )
      {
        console.error( 'Failed to create "Open Controls" context menu:', chrome.runtime.lastError );
      }
    } );

    function onSettingsChanged()
    {
      chrome.contextMenus.update( ContextMenuId.AutoPauseEnabled, {
        checked: settings.get( SettingKey.Other.AutoPauseEnabled ),
      }, () =>
      {
        if( chrome.runtime.lastError )
        {
          console.warn( 'Failed to update "Auto-Pause Enabled" context menu following settings initialization/change.' );
        }
      } );
    }

    settings.onInitialized.addEventListener( onSettingsChanged );
    settings.onChanged.addEventListener( onSettingsChanged );
  } );

  chrome.tabs.onActivated.addListener( ( activeTab ) =>
  {
    chrome.contextMenus.update( ContextMenuId.AutoPauseEnabledForTab, {
      checked: isAutoPauseEnabledForTab( activeTab.tabId ),
    }, () =>
    {
      if( chrome.runtime.lastError )
      {
        console.warn( 'Failed to update "Auto-Pause Enabled for Tab" context menu following tab activation.' );
      }
    } );
  } );
}

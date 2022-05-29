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

async function createMenu( createProperties: browser.Menus.CreateCreatePropertiesType )
{
  return new Promise<void>( ( resolve, reject ) =>
  {
    browser.contextMenus.create( createProperties, () =>
    {
      if( browser.runtime.lastError )
      {
        return reject( new Error( browser.runtime.lastError.message ) );
      }

      return resolve();
    } );
  } );
}

export function initMenus()
{
  browser.contextMenus.onClicked.addListener( async ( info, tab ) =>
  {
    if( info.menuItemId === ContextMenuId.ReloadExtension )
    {
      browser.runtime.reload();
    }
    else if( info.menuItemId === ContextMenuId.AutoPauseEnabled )
    {
      console.log( 'Auto-Pause Enabled:', info.checked );
      await settings.set( SettingKey.Other.AutoPauseEnabled, info.checked ?? true );
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

  browser.runtime.onInstalled.addListener( async () =>
  {
    await browser.contextMenus.removeAll();

    if( process.env.NODE_ENV === 'development' )
    {
      try
      {
        await createMenu( {
          id: ContextMenuId.ReloadExtension,
          title: 'Reload Extension',
          contexts: [ 'browser_action' ],
        } );
      }
      catch( e )
      {
        console.error( 'Failed to create "Reload Extension" context menu', e );
      }
    }

    try
    {
      await createMenu( {
        id: ContextMenuId.AutoPauseEnabled,
        type: 'checkbox',
        title: 'Auto-Pause Enabled',
        checked: settings.get( SettingKey.Other.AutoPauseEnabled ),
        contexts: [ 'browser_action' ],
      } );
    }
    catch( e )
    {
      console.error( 'Failed to create "Auto-Pause Enabled" context menu', e );
    }

    try
    {
      await createMenu( {
        id: ContextMenuId.AutoPauseEnabledForTab,
        type: 'checkbox',
        title: 'Auto-Pause Enabled for Tab',
        checked: true,
        contexts: [ 'browser_action' ],
      } );
    }
    catch( e )
    {
      console.error( 'Failed to create "Auto-Pause Enabled for Tab" context menu', e );
    }

    try
    {
      await createMenu( {
        id: ContextMenuId.OpenControls,
        title: 'Open Controls',
        contexts: [ 'browser_action' ],
      } );
    }
    catch( e )
    {
      console.error( 'Failed to create "Open Controls" context menu', e );
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

  function onTabChange()
  {
    chrome.tabs.query( { active: true, currentWindow: true }, ( tabs ) =>
    {
      if( chrome.runtime.lastError )
      {
        console.warn( 'Failed to retrieve active tab for context menus:', chrome.runtime.lastError );
        return;
      }

      if( tabs.length <= 0 )
      {
        console.log( 'No active tabs currently.' );
        return;
      }

      const tab = tabs[ 0 ];
      if( tabs.length > 1 )
      {
        console.log( 'Multiple active tabs in the current window:', tabs );
      }

      if( typeof tab.id !== 'number' )
      {
        console.warn( 'Active window tab has no ID:', tab );
        return;
      }

      chrome.contextMenus.update( ContextMenuId.AutoPauseEnabledForTab, {
        checked: isAutoPauseEnabledForTab( tab.id ),
      }, () =>
      {
        if( chrome.runtime.lastError )
        {
          console.warn( 'Failed to update "Auto-Pause Enabled for Tab" context menu following tab activation.' );
        }
      } );
    } );
  }

  chrome.tabs.onActivated.addListener( onTabChange );
  chrome.windows.onFocusChanged.addListener( onTabChange );
  onTabChange();
}

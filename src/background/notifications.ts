import { BackgroundController } from './backgroundController';

import settings, { SettingKey } from '../common/settings';
import { CONTROLLER_NAMES } from '../common/controllers';
import { getTab, getWindow } from '../common/browserExtension';
import { BackgroundMessageId } from '../common/background_messages';

enum StartedPlayingNotificationButtions
{
  Pause,
  Next,
}

enum AutoPauseNotificationButtons
{
  Resume,
  ResumeAndDisableAutoPause,
}

const startedPlayingNotifications: { [ notificationId: string ]: BackgroundController | undefined } = {};
const autoPauseNotifications: { [ notificationId: string ]: BackgroundController | undefined } = {};

export async function showStartedPlayingNotification( controller: BackgroundController ): Promise<void>
{
  if( !settings.get( SettingKey.Other.NotificationsEnabled ) )
  {
    return;
  }

  if( !controller.media.track
    || !controller.media.artist
    || !controller.media.artwork )
  {
    return;
  }

  if( settings.get( SettingKey.Other.NoActiveWindowNotifications )
    && ( await controller.isActiveTab() ) )
  {
    return;
  }

  const buttons: chrome.notifications.ButtonOptions[] = [];
  buttons[ StartedPlayingNotificationButtions.Pause ] = { title: 'Pause' };
  buttons[ StartedPlayingNotificationButtions.Next ] = { title: 'Next' };

  chrome.notifications.create( {
    type: 'basic',
    silent: true,
    title: controller.media.track,
    message: controller.media.artist,
    contextMessage: controller.media.album ?? undefined,
    iconUrl: controller.media.artwork,
    buttons,
  }, ( notificationId ) =>
  {
    if( chrome.runtime.lastError )
    {
      console.log( 'Failed to create media notification:', controller.name, controller, chrome.runtime.lastError );
      return;
    }

    startedPlayingNotifications[ notificationId ] = controller;
  } );
}

export function showAutoPauseNotification( controller: BackgroundController ): void
{
  if( !settings.get( SettingKey.Other.ShowAutoPausedNotification ) )
  {
    return;
  }

  const buttons: chrome.notifications.ButtonOptions[] = [];
  buttons[ AutoPauseNotificationButtons.Resume ] = { title: 'Resume' };
  buttons[ AutoPauseNotificationButtons.ResumeAndDisableAutoPause ] = { title: 'Resume and Disable Auto-Pause for Tab' };

  chrome.notifications.create( {
    type: 'basic',
    silent: true,
    title: `${CONTROLLER_NAMES[ controller.controllerId ]} has been auto-paused`,
    message: controller.media.track ?? '',
    iconUrl: 'assets/icon64.png',
    buttons,
  }, ( notificationId ) =>
  {
    if( chrome.runtime.lastError )
    {
      console.error( 'Failed to create auto-pause notification:', controller.name, controller, chrome.runtime.lastError );
    }

    autoPauseNotifications[ notificationId ] = controller;
  } );
}

function onNotificationClosed( notificationId: string )
{
  delete startedPlayingNotifications[ notificationId ];
  delete autoPauseNotifications[ notificationId ];
}

async function onNotificationClicked( notificationId: string )
{
  const controller = startedPlayingNotifications[ notificationId ] ?? autoPauseNotifications[ notificationId ];
  if( !controller )
  {
    console.warn( 'Could not find controller for notification:', notificationId );
    return;
  }

  const tabId = controller.tabId;
  if( typeof tabId !== 'number' )
  {
    console.warn( 'Controller does not have an associated tab:', controller );
    return;
  }

  try
  {
    const tab = await getTab( tabId );
    if( typeof tab.windowId !== 'number' )
    {
      console.warn( 'Tab has no window ID', notificationId, controller, tab );
      return;
    }

    const window = await getWindow( tab.windowId );
    if( typeof window.id !== 'number' )
    {
      console.warn( 'Window has no ID:', notificationId, controller, tab, window );
      return;
    }

    chrome.tabs.update( tabId, { active: true } );
    chrome.windows.update( window.id, { focused: true, drawAttention: true } );
  }
  catch( e )
  {
    console.error( 'Failed to handle notification onClick:', notificationId, e );
  }
}

function onStartedPlayingNotificationButtonClicked( notificationId: string, buttonIndex: number, controller: BackgroundController )
{
  if( buttonIndex === StartedPlayingNotificationButtions.Pause )
  {
    controller.sendMessage( BackgroundMessageId.Pause );
  }
  else if( buttonIndex === StartedPlayingNotificationButtions.Next )
  {
    controller.sendMessage( BackgroundMessageId.Next );
  }
  else
  {
    console.warn( 'Unhandled started playing notification button:', notificationId, buttonIndex, controller );
  }
}

function onAutoPauseNotificationButtonClicked( notificationId: string, buttonIndex: number, controller: BackgroundController )
{
  if( buttonIndex === AutoPauseNotificationButtons.Resume )
  {
    controller.sendMessage( BackgroundMessageId.Play );
  }
  else if( buttonIndex === AutoPauseNotificationButtons.ResumeAndDisableAutoPause )
  {
    // TODO
  }
  else
  {
    console.warn( 'Unhandled auto-pause notification button:', notificationId, buttonIndex, controller );
  }
}

function onNotificationButtonClicked( notificationId: string, buttonIndex: number )
{
  let controller = startedPlayingNotifications[ notificationId ];
  if( controller )
  {
    onStartedPlayingNotificationButtonClicked( notificationId, buttonIndex, controller );
  }

  controller = autoPauseNotifications[ notificationId ];
  if( controller )
  {
    onAutoPauseNotificationButtonClicked( notificationId, buttonIndex, controller );
  }
}

export function initNotifications(): void
{
  chrome.notifications.onClosed.addListener( onNotificationClosed );
  chrome.notifications.onClicked.addListener( onNotificationClicked );
  chrome.notifications.onButtonClicked.addListener( onNotificationButtonClicked );
}

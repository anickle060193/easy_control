import { BackgroundController } from './backgroundController';

import settings, { SettingKey } from '../common/settings';
import { ControllerCommand, CONTROLLERS } from '../common/controllers';
import { getBrowserName } from '../common/util';

enum StartedPlayingNotificationButtions
{
  Pause,
  Next,
}

enum AutoPauseNotificationButtons
{
  Resume,
}

const startedPlayingNotifications: { [ notificationId: string ]: BackgroundController | undefined } = {};
const autoPauseNotifications: { [ notificationId: string ]: BackgroundController | undefined } = {};

export async function showStartedPlayingNotification( controller: BackgroundController ): Promise<boolean>
{
  if( !controller.media.track
    || !controller.media.artist
    || !controller.media.artwork )
  {
    console.warn( 'Missing track, artist, and/or artwork for media changed notification:', controller.id, controller );
    return false;
  }

  if( !settings.get( SettingKey.Other.NotificationsEnabled )
    || !settings.get( CONTROLLERS[ controller.controllerId ].notificationsEnabledSetting ) )
  {
    return true;
  }

  if( settings.get( SettingKey.Other.NoActiveWindowNotifications )
    && ( await controller.isActiveTab() ) )
  {
    return true;
  }

  try
  {
    const notificationOptions: browser.Notifications.CreateNotificationOptions = {
      type: 'basic',
      title: controller.media.track,
      message: controller.media.artist,
      contextMessage: controller.media.album ?? undefined,
      iconUrl: controller.media.artwork,
    };

    if( await getBrowserName() === 'chrome' )
    {
      const buttons: chrome.notifications.ButtonOptions[] = [];
      buttons[ StartedPlayingNotificationButtions.Pause ] = { title: 'Pause' };
      buttons[ StartedPlayingNotificationButtions.Next ] = { title: 'Next' };

      ( notificationOptions as chrome.notifications.NotificationOptions ).buttons = buttons;

      ( notificationOptions as chrome.notifications.NotificationOptions ).silent = true;
    }

    const notificationId = await browser.notifications.create( `notification::started-playing::${controller.id}`, notificationOptions );
    startedPlayingNotifications[ notificationId ] = controller;
  }
  catch( e )
  {
    console.log( 'Failed to create media notification:', controller.id, controller, e );
  }

  return true;
}

export async function showAutoPauseNotification( controller: BackgroundController ): Promise<void>
{
  if( !settings.get( SettingKey.Other.ShowAutoPausedNotification ) )
  {
    return;
  }

  try
  {
    const notificationOptions: browser.Notifications.CreateNotificationOptions = {
      type: 'basic',
      title: `${CONTROLLERS[ controller.controllerId ].name} has been auto-paused`,
      message: controller.media.track ?? '',
      iconUrl: 'assets/icon64.png',
    };

    if( await getBrowserName() === 'chrome' )
    {
      const buttons: chrome.notifications.ButtonOptions[] = [];
      buttons[ AutoPauseNotificationButtons.Resume ] = { title: 'Resume' };

      ( notificationOptions as chrome.notifications.NotificationOptions ).buttons = buttons;

      ( notificationOptions as chrome.notifications.NotificationOptions ).silent = true;
    }

    const notificationId = await browser.notifications.create( `notification::auto-pause::${controller.id}`, notificationOptions );
    autoPauseNotifications[ notificationId ] = controller;
  }
  catch( e )
  {
    console.error( 'Failed to create auto-pause notification:', controller.id, controller, e );
  }
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
    const tab = await browser.tabs.get( tabId );
    if( typeof tab.windowId !== 'number' )
    {
      console.warn( 'Tab has no window ID', notificationId, controller, tab );
      return;
    }

    const window = await browser.windows.get( tab.windowId );
    if( typeof window.id !== 'number' )
    {
      console.warn( 'Window has no ID:', notificationId, controller, tab, window );
      return;
    }

    await browser.tabs.update( tabId, { active: true } );
    await browser.windows.update( window.id, { focused: true, drawAttention: true } );
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
    controller.sendCommand( ControllerCommand.Pause );
  }
  else if( buttonIndex === StartedPlayingNotificationButtions.Next )
  {
    controller.sendCommand( ControllerCommand.Next );
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
    controller.sendCommand( ControllerCommand.Play );
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
  browser.notifications.onClosed.addListener( onNotificationClosed );
  browser.notifications.onClicked.addListener( onNotificationClicked );
  browser.notifications.onButtonClicked.addListener( onNotificationButtonClicked );
}

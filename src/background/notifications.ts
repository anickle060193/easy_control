import { BackgroundController } from './backgroundController';

import settings, { SettingKey } from '../common/settings';
import { ControllerCommand, CONTROLLERS } from '../common/controllers';

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
    new Notification( controller.media.track, {
      tag: `notification::started-playing::${controller.id}`,
      body: [ controller.media.artist, controller.media.artist ].filter( ( s ): s is string => !!s ).join( '\n' ),
      icon: controller.media.artwork,
      actions: [
        { action: 'pause', title: 'Pause' },
        { action: 'next', title: 'Next' },
      ],
    } );

    // const buttons: browser.Notifications.ButtonOptions[] = [];
    // buttons[ StartedPlayingNotificationButtions.Pause ] = { title: 'Pause' };
    // buttons[ StartedPlayingNotificationButtions.Next ] = { title: 'Next' };

    // const notificationId = await browser.notifications.create( `notification::started-playing::${controller.id}`, {
    //   type: 'basic',
    //   title: controller.media.track,
    //   message: controller.media.artist,
    //   contextMessage: controller.media.album ?? undefined,
    //   iconUrl: controller.media.artwork,
    //   buttons,
    // } );
    // startedPlayingNotifications[ notificationId ] = controller;
  }
  catch( e )
  {
    console.log( 'Failed to create media notification:', controller.id, controller, e );
  }

  return true;
}

export function showAutoPauseNotification( controller: BackgroundController ): void
{
  if( !settings.get( SettingKey.Other.ShowAutoPausedNotification ) )
  {
    return;
  }

  try
  {
    new Notification( `${CONTROLLERS[ controller.controllerId ].name} has been auto-paused`, {
      body: controller.media.track ?? undefined,
      icon: browser.runtime.getURL( 'assets/icon64.png' ),
      actions: [
        { action: 'resume', title: 'Resume' },
      ],
    } );

    // const buttons: browser.Notifications.ButtonOptions[] = [];
    // buttons[ AutoPauseNotificationButtons.Resume ] = { title: 'Resume' };

    // const notificationId = await browser.notifications.create( `notification::auto-pause::${controller.id}`, {
    //   type: 'basic',
    //   silent: true,
    //   title: `${CONTROLLERS[ controller.controllerId ].name} has been auto-paused`,
    //   message: controller.media.track ?? '',
    //   iconUrl: 'assets/icon64.png',
    //   buttons,
    // } );
    // autoPauseNotifications[ notificationId ] = controller;
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

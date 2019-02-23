import { BackgroundController } from 'background/controller';
import { focusTab } from 'background/utilities';

import { SettingKey, settings } from 'common/settings';
import { setAutoPauseEnabledForTab } from './autoPauser';

const enum NewContentNotificationButton
{
  Pause = 0,
  Next = 1,
}

const enum AutoPauseNotificationButton
{
  Resume = 0,
}

let newContentNotifications: { [ notificationId: string ]: BackgroundController | undefined } = {};
let autoPausedNotifications: { [ notificationId: string ]: BackgroundController | undefined } = {};

export function showNewContextNotification( controller: BackgroundController )
{
  if( !controller.content )
  {
    console.warn( 'Controller has no content.' );
    return;
  }

  if( !settings.get( SettingKey.Notifications[ controller.name ] ) )
  {
    return;
  }

  if( controller.active
    && settings.get( SettingKey.Other.NoActiveWindowNotifications ) )
  {
    return;
  }

  console.log( 'New Content Info:', controller.content );

  let buttons: chrome.notifications.ButtonOptions[] = [];
  buttons[ NewContentNotificationButton.Pause ] = { title: 'Pause' };
  buttons[ NewContentNotificationButton.Next ] = { title: 'Next' };

  let notificationOptions: chrome.notifications.NotificationOptions = {
    type: 'basic',
    iconUrl: controller.content.image ? controller.content.image : 'res/icon128.png',
    title: controller.content.title,
    message: controller.content.caption,
    contextMessage: controller.content.subcaption,
    buttons: buttons,
    requireInteraction: true,
    isClickable: true
  };

  for( let notificationId of Object.keys( newContentNotifications ) )
  {
    chrome.notifications.clear( notificationId );
  }
  newContentNotifications = {};

  console.log( 'Showing notification for', controller.name, notificationOptions );
  chrome.notifications.create( '', notificationOptions, ( notificationId ) =>
  {
    if( chrome.runtime.lastError )
    {
      console.error( 'Failed to show new content notification:', chrome.runtime.lastError );
      return;
    }

    newContentNotifications[ notificationId ] = controller;

    let notificationLength = settings.get( SettingKey.Other.NotificationLength );
    if( !notificationLength || notificationLength < 1 )
    {
      notificationLength = 10;
    }

    window.setTimeout( () =>
    {
      chrome.notifications.clear( notificationId );
    }, notificationLength * 1000 );
  } );
}

export function showAutoPauseNotification( controller: BackgroundController, notificationLength: number = 10 )
{
  if( !controller.content )
  {
    console.warn( 'Controller has no content.' );
    return;
  }

  if( !settings.get( SettingKey.Other.ShowAutoPausedNotification ) )
  {
    return;
  }

  let buttons: chrome.notifications.ButtonOptions[] = [];
  buttons[ AutoPauseNotificationButton.Resume ] = { title: 'Resume Playback (will prevent future auto-pausing of tab)' };

  let notificationOptions: chrome.notifications.NotificationOptions = {
    type: 'basic',
    iconUrl: controller.content.image ? controller.content.image : 'icon128.png',
    title: controller.content.title,
    message: controller.content.caption,
    contextMessage: controller.content.subcaption,
    buttons: buttons,
    requireInteraction: true,
    isClickable: true
  };

  chrome.notifications.create( '', notificationOptions, ( notificationId ) =>
  {
    if( chrome.runtime.lastError )
    {
      console.error( 'Failed to show auto-paused notification:', chrome.runtime.lastError );
      return;
    }

    autoPausedNotifications[ notificationId ] = controller;

    if( notificationLength < 1 )
    {
      notificationLength = 10;
    }

    window.setTimeout( () =>
    {
      chrome.notifications.clear( notificationId );
    }, notificationLength * 1000 );
  } );
}

chrome.notifications.onClicked.addListener( ( notificationId ) =>
{
  console.log( 'Notification Clicked:', notificationId );

  chrome.notifications.clear( notificationId );

  let controller = newContentNotifications[ notificationId ] || autoPausedNotifications[ notificationId ];
  if( controller && controller.port.sender && controller.port.sender.tab )
  {
    focusTab( controller.port.sender.tab );
  }
} );

chrome.notifications.onButtonClicked.addListener( ( notificationId, buttonIndex ) =>
{
  console.log( 'Notification Button Clicked - Notification: ' + notificationId + ' Button: ' + buttonIndex );

  chrome.notifications.clear( notificationId );

  if( notificationId in newContentNotifications )
  {
    let controller = newContentNotifications[ notificationId ];
    if( !controller )
    {
      console.error( 'Controller does not exist for new content notification:', notificationId );
      return;
    }

    if( buttonIndex === NewContentNotificationButton.Pause )
    {
      controller.pause();
    }
    else if( buttonIndex === NewContentNotificationButton.Next )
    {
      controller.next();
    }
    else
    {
      console.warn( 'Unknown new content notification button:', buttonIndex );
    }
  }
  else if( typeof autoPausedNotifications[ notificationId ] !== 'undefined' )
  {
    let controller = autoPausedNotifications[ notificationId ];
    if( !controller )
    {
      console.error( 'Controller does not exist for auto-paused notification:', notificationId );
      return;
    }

    if( buttonIndex === AutoPauseNotificationButton.Resume )
    {
      if( controller.port.sender && controller.port.sender.tab && controller.port.sender.tab.id )
      {
        setAutoPauseEnabledForTab( controller.port.sender.tab.id, false );
      }
      controller.play();
    }
  }
} );

chrome.notifications.onClosed.addListener( ( notificationId ) =>
{
  delete newContentNotifications[ notificationId ];
  delete autoPausedNotifications[ notificationId ];
} );

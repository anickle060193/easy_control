import * as _ from 'lodash';

import { BackgroundController } from './controller';
import { updateBrowserActionIcon } from './icon';
import { Message, MessageTypes } from '../common/message';
import { checkError } from '../common/utilities'
import { Settings, siteToUrl, getDefaultSettings, SettingsType } from '../common/settings';
import { focusTab } from './utilities';

const CONTEXT_MENU_AUTO_PAUSE_ENABLED = 'auto_pause_enabled';
const CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB = 'auto_pause_enabled_for_tab';

const NEW_CONTENT_NOTIFICATION_PAUSE_BUTTON = 0;
const NEW_CONTENT_NOTIFICATION_NEXT_BUTTON = 1;

const AUTO_PAUSE_NOTIFICATION_RESUME_BUTTON = 0;

let controllers: BackgroundController[] = [];
let currentController: BackgroundController | null = null;

let newContentNotifications = {};
let autoPausedNotifications = {};

let autoPauseDisabledTabs = {};

let settings: Partial<SettingsType> = {};

let tabs: { [ id: number ]: string } = {};

function handleMessage( message: Message, controller: BackgroundController )
{
  if( message.type === MessageTypes.ToBackground.Initialize )
  {
    console.log( 'Controller Initialized: ' + controller.name );
    controller.color = message.data.color;
    controller.allowPauseOnInactivity = message.data.allowPauseOnInactivity;
    controller.hostname = message.data.hostname;
  }
  else if( message.type === MessageTypes.ToBackground.Status )
  {
    let progressChanged = controller.progress !== message.data.progress;
    let pausedChanged = controller.paused !== message.data.paused;

    controller.paused = message.data.paused;
    controller.progress = message.data.progress;
    controller.active = message.data.active;

    if( currentController === null )
    {
      if( pausedChanged && !controller.paused )
      {
        console.log( 'Status - No Current Controller - Unpaused - ' + controller.name );
        currentController = controller;
      }
    }
    else if( currentController !== controller )
    {
      if( pausedChanged && !controller.paused )
      {
        console.log( 'Status - Not Current Controller - Other Unpaused - ' + controller.name );
        let index = controllers.indexOf( controller );
        if( index >= 0 )
        {
          controllers.splice( index, 1 );
        }
        controllers.push( controller );
        currentController = controller;

        if( !autoPauseDisabledTabs[ currentController.port.sender!.tab!.id! ] )
        {
          autoPause( currentController );
        }
      }
    }

    if( currentController === controller )
    {
      if( progressChanged || pausedChanged )
      {
        updateBrowserActionIcon( currentController );
      }
    }
  }
  else if( message.type === MessageTypes.ToBackground.NewContent )
  {
    console.log( 'New Content - ' + controller.name );
    controller.content = message.data

    if( currentController === controller )
    {
      for( let notificationId in newContentNotifications )
      {
        chrome.notifications.clear( notificationId );
      }
      newContentNotifications = {};

      if( settings[ Settings.Notifications[ controller.name ] ] )
      {
        if( !controller.active || !settings[ Settings.Other.NoActiveWindowNotifications ] )
        {
          console.log( 'Content Info:' );
          console.log( controller.content );

          let buttons = [];
          buttons[ NEW_CONTENT_NOTIFICATION_PAUSE_BUTTON ] = { title: 'Pause' };
          buttons[ NEW_CONTENT_NOTIFICATION_NEXT_BUTTON ] = { title: 'Next' };

          let notificationOptions = {
            type: 'basic',
            iconUrl: controller.content.image ? controller.content.image : 'res/icon128.png',
            title: controller.content.title,
            message: controller.content.caption,
            contextMessage: controller.content.subcaption,
            buttons: buttons,
            requireInteraction: true,
            isClickable: true
          };

          console.log( 'Showing notification for ' + controller.name );
          console.log( notificationOptions );
          chrome.notifications.create( '', notificationOptions, ( notificationId ) =>
          {
            if( checkError() )
            {
              newContentNotifications[ notificationId ] = controller;
              let notificationLength = settings[ Settings.Other.NotificationLength ];
              if( !notificationLength || notificationLength < 1 )
              {
                notificationLength = 10;
              }

              setTimeout( () =>
              {
                chrome.notifications.clear( notificationId );
              }, notificationLength * 1000 );
            }
          } );
        }
        else
        {
          console.log( 'Not showing notification due to NoActiveWindowNotifications.' );
        }
      }
    }
  }
}


function handleDisconnect( controller: BackgroundController )
{
  _.remove( controllers, controller );

  console.log( 'Controller Disconnect: ' + controller.name );

  if( currentController === controller )
  {
    console.log( 'Controller Disconnect: Was last port' );

    if( controllers.length > 0 )
    {
      currentController = controllers[ controllers.length - 1 ];
      console.log( currentController.name + ' promoted to currentController' );
    }
    else
    {
      currentController = null;
      console.log( 'No other controllers to promote' );
    }
    updateBrowserActionIcon( currentController );
  }
}


function showAutoPauseNotification( controller: BackgroundController, notificationLength: number = 10 )
{
  if( !controller.content )
  {
    console.warn( 'Controller has not content.' );
    return;
  }

  let buttons = [];
  buttons[ AUTO_PAUSE_NOTIFICATION_RESUME_BUTTON ] = { title: 'Resume Playback (will prevent future auto-pausing of tab)' };

  let notificationOptions = {
    type: 'basic',
    iconUrl: controller.content.image ? controller.content.image : 'res/icon128.png',
    title: controller.content.title,
    message: controller.content.caption,
    contextMessage: controller.content.subcaption,
    buttons: buttons,
    requireInteraction: true,
    isClickable: true
  };

  chrome.notifications.create( '', notificationOptions, ( notificationId ) =>
  {
    if( checkError() )
    {
      autoPausedNotifications[ notificationId ] = controller;

      if( notificationLength < 1 )
      {
        notificationLength = 10;
      }

      setTimeout( () =>
      {
        chrome.notifications.clear( notificationId );
      }, notificationLength * 1000 );
    }
  } );
}


export function autoPause( exclusion: BackgroundController )
{
  if( settings[ Settings.Other.AutoPauseEnabled ] )
  {
    for( let i = 0; i < controllers.length; i++ )
    {
      if( controllers[ i ] !== exclusion && !controllers[ i ].paused && !autoPauseDisabledTabs[ controllers[ i ].port.sender!.tab!.id! ] )
      {
        console.log( 'Auto-Pausing ' + controllers[ i ].name );
        controllers[ i ].pause();

        if( settings[ Settings.Other.ShowAutoPausedNotification ] )
        {
          showAutoPauseNotification( controllers[ i ], settings[ Settings.Other.NotificationLength ] );
        }
      }
    }
  }
}


export function pause()
{
  for( let i = 0; i < controllers.length; i++ )
  {
    if( !controllers[ i ].paused )
    {
      console.log( 'Pausing ' + controllers[ i ].name );
      controllers[ i ].pause();
    }
  }
}


export function play()
{
  if( currentController )
  {
    currentController.play();
  }
}


export function next()
{
  if( currentController )
  {
    currentController.next();
  }
}


export function previous()
{
  if( currentController )
  {
    currentController.previous();
  }
}


export function like()
{
  if( currentController )
  {
    currentController.like();
  }
}


export function unlike()
{
  if( currentController )
  {
    currentController.unlike();
  }
}


export function dislike()
{
  if( currentController )
  {
    currentController.dislike();
  }
}


export function undislike()
{
  if( currentController )
  {
    currentController.undislike();
  }
}


export function volumeUp()
{
  if( currentController )
  {
    currentController.volumeUp();
  }
}


export function volumeDown()
{
  if( currentController )
  {
    currentController.volumeDown();
  }
}


export function playPause()
{
  if( currentController )
  {
    if( currentController.paused )
    {
      currentController.play();
    }
    else
    {
      currentController.pause();
    }
  }
  else if( controllers.length === 0 )
  {
    let site = settings[ Settings.Other.DefaultSite ];
    if( site )
    {
      let url = siteToUrl( site );
      if( url )
      {
        chrome.tabs.create( { url: url }, function( tab )
        {
          focusTab( tab );
        } );
      }
    }
  }
}


export function copyContentLink()
{
  console.log( currentController );
  if( currentController && currentController.content && currentController.content.link )
  {
    console.log( 'Copying content link: ' + currentController.content.link );
    let input = $( '<input>' )
      .prop( 'type', 'text' )
      .val( currentController.content.link )
      .appendTo( document.body );
    ( input[ 0 ] as HTMLInputElement ).select();

    try
    {
      document.execCommand( 'copy' );
    }
    catch( e )
    {
      console.log( 'Copy Failed - ' + e );
    }

    input.remove();
  }
  else
  {
    console.log( 'No content to copy' );
  }
}


function onStart()
{
  console.log( 'Background Start' );

  chrome.runtime.onConnect.addListener( function( port )
  {
    console.log( 'Port Connect: ' + port.name );
    console.log( port );

    let controller = new BackgroundController( port );

    controllers.splice( 0, 0, controller );

    controller.port.onMessage.addListener( function( message: Message )
    {
      handleMessage( message, controller );
    } );

    controller.port.onDisconnect.addListener( function()
    {
      handleDisconnect( controller );
    } );
  } );


  chrome.notifications.onClicked.addListener( function( notificationId )
  {
    chrome.notifications.clear( notificationId );

    if( typeof newContentNotifications[ notificationId ] !== 'undefined' )
    {
      let controller = newContentNotifications[ notificationId ];
      focusTab( controller.port.sender.tab );
    }
    else if( typeof autoPausedNotifications[ notificationId ] !== 'undefined' )
    {
      let controller = autoPausedNotifications[ notificationId ];
      focusTab( controller.port.sender.tab );
    }
  } );


  chrome.notifications.onButtonClicked.addListener( function( notificationId, buttonIndex )
  {
    console.log( 'Notification Button Clicked - Notification: ' + notificationId + ' Button: ' + buttonIndex );
    if( typeof newContentNotifications[ notificationId ] !== 'undefined' )
    {
      let controller = newContentNotifications[ notificationId ];

      if( buttonIndex === NEW_CONTENT_NOTIFICATION_PAUSE_BUTTON )
      {
        controller.pause();
      }
      else if( buttonIndex === NEW_CONTENT_NOTIFICATION_NEXT_BUTTON )
      {
        controller.next();
      }

      chrome.notifications.clear( notificationId );
    }
    else if( typeof autoPausedNotifications[ notificationId ] !== 'undefined' )
    {
      if( buttonIndex === AUTO_PAUSE_NOTIFICATION_RESUME_BUTTON )
      {
        let controller = autoPausedNotifications[ notificationId ];
        autoPauseDisabledTabs[ controller.port.sender.tab.id ] = true;
        controller.play();
      }

      chrome.notifications.clear( notificationId );
    }
  } );


  chrome.notifications.onClosed.addListener( function( notificationId )
  {
    if( typeof newContentNotifications[ notificationId ] !== 'undefined' )
    {
      delete newContentNotifications[ notificationId ];
    }
    else if( typeof autoPausedNotifications[ notificationId ] !== 'undefined' )
    {
      delete autoPausedNotifications[ notificationId ];
    }
  } );


  chrome.runtime.onInstalled.addListener( function( details )
  {
    let version = chrome.runtime.getManifest().version;

    let possiblyShowChangelog = false;
    if( details.reason === 'install' )
    {
      console.log( 'Installing version ' + version );
      possiblyShowChangelog = true;
    }
    else if( details.reason === 'update' )
    {
      console.log( 'Updating to version ' + version );
      possiblyShowChangelog = true;
    }
    else
    {
      console.log( 'Not installing or updating:' );
      console.log( details );
    }

    let autoPauseContextMenu = {
      type: 'checkbox',
      id: CONTEXT_MENU_AUTO_PAUSE_ENABLED,
      title: 'Auto-Pause Enabled',
      checked: true,
      contexts: [ 'browser_action' ]
    };
    chrome.contextMenus.create( autoPauseContextMenu );

    let autoPauseTabContextMenu = {
      type: 'checkbox',
      id: CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB,
      title: 'Auto-Pause Enabled for Tab',
      checked: true,
      contexts: [ 'browser_action' ]
    };
    chrome.contextMenus.create( autoPauseTabContextMenu );

    chrome.storage.sync.get( null, function( settings )
    {
      let defaults = getDefaultSettings();

      let updatedSettings = $.extend( {}, defaults, settings );

      console.log( 'Updating Settings' );

      chrome.storage.sync.set( updatedSettings );

      if( possiblyShowChangelog && updatedSettings[ Settings.Other.ShowChangeLogOnUpdate ] )
      {
        chrome.tabs.create( { url: 'change_log/change_log.html' } );
      }
    } );
  } );


  chrome.runtime.onStartup.addListener( function()
  {
    console.log( 'Background - onStartup()' );
  } );


  chrome.runtime.onSuspend.addListener( function()
  {
    console.log( 'Background - onSuspend()' );
  } );


  chrome.runtime.onSuspendCanceled.addListener( function()
  {
    console.log( 'Background - onSuspendCanceled()' );
  } );


  chrome.idle.onStateChanged.addListener( function( newState )
  {
    console.log( 'State Changed: ' + newState );
    if( currentController && !currentController.paused )
    {
      if( newState === 'locked' )
      {
        if( settings[ Settings.Other.PauseOnLock ] )
        {
          console.log( 'Pausing due to Lock' );
          pause();
        }
      }
      else if( newState === 'idle' )
      {
        if( settings[ Settings.Other.PauseOnInactivity ] && currentController.allowPauseOnInactivity )
        {
          console.log( 'Pausing due to Inactivity' );
          pause();
        }
      }
    }
  } );


  chrome.storage.onChanged.addListener( function( changes, ns )
  {
    console.log( 'Settings Changed:' );

    for( let setting in changes )
    {
      console.log( 'Setting: ' + setting + ' - Old: ' + settings[ setting ] + ' - New: ' + changes[ setting ].newValue );
      settings[ setting ] = changes[ setting ].newValue;
    }

    if( typeof changes[ Settings.Other.InactivityTimeout ] !== 'undefined' )
    {
      chrome.idle.setDetectionInterval( settings[ Settings.Other.InactivityTimeout ]! );
    }

    if( typeof changes[ Settings.Other.AutoPauseEnabled ] !== 'undefined' )
    {
      chrome.contextMenus.update( 'auto_pause_enabled', { checked: settings[ Settings.Other.AutoPauseEnabled ] } );
    }
  } );


  function urlUpdated( tab: chrome.tabs.Tab )
  {
    let hostname = new URL( tab.url! ).hostname;
    if( hostname )
    {
      $.each( controllers, function( i, controller )
      {
        if( controller.port.sender!.tab!.id !== tab.id
          && controller.hostname
          && hostname.includes( controller.hostname )
          && settings[ Settings.OpenInExisting[ controller.name ] ] )
        {
          console.log( 'Already have ' + controller.name + ' controller.' );
          chrome.tabs.remove( tab.id! );

          let existingTab = controller.port.sender!.tab;

          focusTab( existingTab );

          controller.openContent( tab.url! );

          return false;
        }

        return;
      } );
    }
  }


  chrome.tabs.onCreated.addListener( function( tab )
  {
    tabs[ tab.id! ] = tab.url!;
    if( tab.url )
    {
      urlUpdated( tab );
    }
  } );


  chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab )
  {
    if( typeof changeInfo.url !== 'undefined' )
    {
      if( tabs[ tabId ] !== tab.url )
      {
        urlUpdated( tab );
        tabs[ tabId ] = tab.url!;
      }
    }
  } );


  chrome.tabs.onRemoved.addListener( function( tabId, removeInfo )
  {
    delete tabs[ tabId ];
  } );


  chrome.tabs.onActivated.addListener( function( activateInfo )
  {
    chrome.contextMenus.update( CONTEXT_MENU_AUTO_PAUSE_ENABLED, { checked: settings[ Settings.Other.AutoPauseEnabled ] } );
    chrome.contextMenus.update( CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB, { checked: !autoPauseDisabledTabs[ activateInfo.tabId ] } );
  } );


  chrome.contextMenus.onClicked.addListener( function( info, tab )
  {
    if( info.menuItemId === CONTEXT_MENU_AUTO_PAUSE_ENABLED )
    {
      console.log( 'Auto-Pause Enabled: ' + info.checked );
      chrome.storage.sync.set( { [ Settings.Other.AutoPauseEnabled ]: info.checked } );
    }
    else if( info.menuItemId === CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB )
    {
      console.log( 'Auto-Pause Enabled for Tab: Tab - ' + tab!.id + ' : ' + info.checked );
      autoPauseDisabledTabs[ tab!.id! ] = !info.checked;
    }
  } );


  chrome.storage.sync.get( null, function( s )
  {
    console.log( 'Background Start - Retrieved Settings' );

    settings = s;

    let inactivityTimeout = settings[ Settings.Other.InactivityTimeout ];
    if( inactivityTimeout )
    {
      chrome.idle.setDetectionInterval( inactivityTimeout );
    }
  } );
}

onStart();

import { BackgroundController } from 'background/controller';
import { isAutoPauseEnabledForTab } from 'background/autoPauser';
import { showAutoPauseNotification, showNewContextNotification } from 'background/notifications';
import { updateBrowserActionIcon } from 'background/browserAction';
import { focusTab } from 'background/utilities';
import { updateControlsPopup } from 'background/controlsPopup';

import { Message, MessageTypes } from 'common/message';
import { SettingKey, settings, siteToUrl } from 'common/settings';

const controllers: BackgroundController[] = [];

let currentController: BackgroundController | null = null;

export function getControllers()
{
  return Array.from( controllers );
}

export function getCurrentController()
{
  return currentController;
}

export function autoPauseControllers( exclusion: BackgroundController )
{
  if( settings.get( SettingKey.Other.AutoPauseEnabled ) )
  {
    for( let controller of controllers )
    {
      let controllerTabId = controller.tabId;
      if( controllerTabId === null )
      {
        console.warn( 'Controller tab does not have an ID:', controller );
        continue;
      }

      if( controller !== exclusion
        && !controller.paused
        && isAutoPauseEnabledForTab( controllerTabId ) )
      {
        console.log( 'Auto-Pausing ' + controller.name );
        controller.pause();

        showAutoPauseNotification( controller );
      }
    }
  }
}

export function playPauseCurrentController()
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
    let site = settings.get( SettingKey.Other.DefaultSite );
    if( site )
    {
      let url = siteToUrl( site );
      if( url )
      {
        chrome.tabs.create( { url: url }, ( tab ) =>
        {
          focusTab( tab );
        } );
      }
    }
  }
}

export function pauseAllControllers()
{
  for( let controller of controllers )
  {
    if( !controller.paused )
    {
      console.log( 'Pausing', controller.name );
      controller.pause();
    }
  }
}

export function playCurrentController()
{
  if( currentController )
  {
    currentController.play();
  }
}

export function pauseCurrentController()
{
  if( currentController )
  {
    currentController.pause();
  }
}

export function nextCurrentController()
{
  if( currentController )
  {
    currentController.next();
  }
}

export function previousCurrentController()
{
  if( currentController )
  {
    currentController.previous();
  }
}

export function likeCurrentController()
{
  if( currentController )
  {
    currentController.like();
  }
}

export function unlikeCurrentController()
{
  if( currentController )
  {
    currentController.unlike();
  }
}

export function dislikeCurrentController()
{
  if( currentController )
  {
    currentController.dislike();
  }
}

export function undislikeCurrentController()
{
  if( currentController )
  {
    currentController.undislike();
  }
}

export function volumeUpCurrentController()
{
  if( currentController )
  {
    currentController.volumeUp();
  }
}

export function volumeDownCurrentController()
{
  if( currentController )
  {
    currentController.volumeDown();
  }
}

export async function copyCurrentControllerContentLink()
{
  if( currentController && currentController.content && currentController.content.link )
  {
    console.log( 'Copying content link:', currentController.content.link );

    let input: HTMLTextAreaElement | null = null;
    try
    {
      input = document.createElement( 'textarea' );
      input.value = currentController.content.link;

      document.body.appendChild( input );

      input.focus();
      input.select();

      document.execCommand( 'copy' );

      console.log( 'Successfully copied content link' );
    }
    catch( e )
    {
      console.error( 'Failed to copy content link:', e );
    }
    finally
    {
      if( input )
      {
        input.remove();
      }
    }
  }
  else
  {
    console.log( 'No content to copy' );
  }
}

function updateControlsPopupForCurrentController()
{
  if( currentController )
  {
    currentController.updateControlsPopup();
  }
  else
  {
    updateControlsPopup( null );
  }
}

function onControllerMessage( message: Message, controller: BackgroundController )
{
  if( message.type === MessageTypes.ToBackground.Initialize )
  {
    console.log( 'Controller Initialized:', controller.name );

    controller.color = message.data.color;
    controller.allowPauseOnInactivity = message.data.allowPauseOnInactivity;
    controller.supportedOperations = message.data.supportedOperations;
    controller.hostname = message.data.hostname;
  }
  else if( message.type === MessageTypes.ToBackground.Status )
  {
    let progressChanged = controller.progress !== message.data.progress;
    let pausedChanged = controller.paused !== message.data.paused;

    controller.onStatus( message.data );

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

        let controllerTabId = currentController.tabId;
        if( controllerTabId )
        {
          if( isAutoPauseEnabledForTab( currentController.port.sender!.tab!.id! ) )
          {
            autoPauseControllers( currentController );
          }
        }
        else
        {
          console.warn( 'Controller tab does not have an ID:', controller );
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

    updateControlsPopupForCurrentController();
  }
  else if( message.type === MessageTypes.ToBackground.NewContent )
  {
    console.log( 'New Content:', controller.name, message.data );
    controller.content = message.data;

    if( currentController === controller )
    {
      showNewContextNotification( controller );

      updateControlsPopupForCurrentController();
    }
  }
}

function onControllerDisconnect( controller: BackgroundController )
{
  let index = controllers.indexOf( controller );
  controllers.splice( index, 1 );

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

    updateControlsPopupForCurrentController();
  }
}

chrome.runtime.onConnect.addListener( ( port ) =>
{
  console.log( 'Port Connect:', port.name );

  let controller = new BackgroundController( port );

  controllers.splice( 0, 0, controller );

  controller.port.onMessage.addListener( ( message ) =>
  {
    onControllerMessage( message, controller );
  } );

  controller.port.onDisconnect.addListener( () =>
  {
    onControllerDisconnect( controller );
  } );
} );

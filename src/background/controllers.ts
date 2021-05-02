import { isAutoPauseEnabledForTab } from './autoPause';
import { updateBrowserActionIcon } from './browserAction';
import { BackgroundController } from './backgroundController';
import { showAutoPauseNotification, showStartedPlayingNotification } from './notifications';

import { BackgroundMessageId } from '../common/backgroundMessages';
import settings, { SettingKey } from '../common/settings';

const controllers: BackgroundController[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
( window as any ).CONTROLLERS = controllers;

export function getCurrentController(): BackgroundController | null
{
  let currentController: BackgroundController | null = null;
  for( const controller of controllers )
  {
    if( controller.status.enabled
      && controller.lastOnPlayedTime > ( currentController?.lastOnPlayedTime ?? 0 ) )
    {
      currentController = controller;
    }
  }

  return currentController;
}

function isCurrentController( controller: BackgroundController )
{
  return controller === getCurrentController();
}

function onNewController( controller: BackgroundController )
{
  controllers.push( controller );

  if( getCurrentController() === controller )
  {
    updateBrowserActionIcon();
  }

  controller.onPlayed.addEventListener( async () =>
  {
    console.log( 'onPlayed:', controller.id, await controller.isActiveTab(), controller );

    if( settings.get( SettingKey.Other.AutoPauseEnabled ) )
    {
      for( const c of controllers )
      {
        if( c === controller
          || !c.status.playing )
        {
          continue;
        }

        const tabId = c.tabId;
        if( typeof tabId !== 'number' )
        {
          console.warn( 'Controller has no associated tab ID:', c );
        }
        else if( !isAutoPauseEnabledForTab( tabId ) )
        {
          continue;
        }

        showAutoPauseNotification( c );

        c.sendMessage( BackgroundMessageId.Pause );
      }
    }

    updateBrowserActionIcon();
  } );

  controller.onPaused.addEventListener( () =>
  {
    console.log( 'onPaused:', controller.id, controller );

    if( isCurrentController( controller ) )
    {
      updateBrowserActionIcon();
    }
  } );

  controller.onProgressChanged.addEventListener( () =>
  {
    // console.log( 'onProgressChanged:', controller.name, '-', controller.status.progress );

    if( isCurrentController( controller ) )
    {
      updateBrowserActionIcon();
    }
  } );

  controller.onMediaChanged.addEventListener( async () =>
  {
    console.log( 'onMediaChanged:', controller.id, controller.media );

    controller.mediaChangedHandled = await showStartedPlayingNotification( controller );
  } );

  controller.onDisconnected.addEventListener( () =>
  {
    console.log( 'onDisconnected:', controller.id, controller );
    const wasCurrentController = isCurrentController( controller );

    const index = controllers.indexOf( controller );
    if( index >= 0 )
    {
      controllers.splice( index, 1 );
    }
    else
    {
      console.warn( 'Could not find controller in controllers list on disconnect:', controller.id, controller );
    }

    if( wasCurrentController )
    {
      updateBrowserActionIcon();
    }
  } );
}

export function initControllers(): void
{
  chrome.runtime.onConnect.addListener( ( port ) =>
  {
    console.log( 'Port connected:', port.name, port );

    onNewController( new BackgroundController( port ) );
  } );
}

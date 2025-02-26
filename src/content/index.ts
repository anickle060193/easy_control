import { BackgroundMessage, BackgroundMessageId } from '../common/backgroundMessages';
import settings, { SettingKey } from '../common/settings';
import { ControllerCommand, ControllerId, CONTROLLERS } from '../common/controllers';
import { UpdateContentMessage } from '../common/contentMessages';

import { GenericAudioVideoController } from './controllers/genericAudioVideo';
import { findMatchingController } from './config';
import { onReady } from './util';
import Controller from './controller';

const PREVENT_DISCONNECT_INTERVAL = 20e3;

const controllerPorts = new Map<Controller, browser.Runtime.Port>();

function connectController( controllerId: ControllerId, controller: Controller )
{
  const port = browser.runtime.connect( { name: controllerId } );
  if( port.error )
  {
    throw port.error;
  }
  console.log( 'Connected port for', controllerId, ':', port );

  controllerPorts.set( controller, port );

  let preventDisconnectTimeout: number | undefined = undefined;

  function preventDisconnect()
  {
    window.clearTimeout( preventDisconnectTimeout );

    preventDisconnectTimeout = window.setTimeout( () =>
    {
      controller.triggerUpdate();

      preventDisconnect();
    }, PREVENT_DISCONNECT_INTERVAL );
  }

  function onControllerUpdate( updateMessage: UpdateContentMessage )
  {
    port.postMessage( updateMessage );

    preventDisconnect();
  }

  controller.onUpdate.addEventListener( onControllerUpdate );

  if( !controller.isRunning )
  {
    controller.start();
  }

  controller.triggerUpdate();

  port.onMessage.addListener( ( message: BackgroundMessage ) =>
  {
    if( message.id === BackgroundMessageId.Command )
    {
      if( message.command === ControllerCommand.PlayPause )
      {
        if( controller.isPlaying() )
        {
          console.log( 'Pausing controller:', controllerId );
          controller.performPause();
        }
        else
        {
          console.log( 'Playing controller:', controllerId );
          controller.performPlay();
        }
      }
      else if( message.command === ControllerCommand.Play )
      {
        if( !controller.isPlaying() )
        {
          console.log( 'Playing controller:', controllerId );
          controller.performPlay();
        }
        else
        {
          console.log( 'Controller is already playing:', controllerId );
        }
      }
      else if( message.command === ControllerCommand.Pause )
      {
        if( controller.isPlaying() )
        {
          console.log( 'Pausing controller:', controllerId );
          controller.performPause();
        }
        else
        {
          console.log( 'Controller is already paused:', controllerId );
        }
      }
      else if( message.command === ControllerCommand.Next )
      {
        controller.performNext();
      }
      else if( message.command === ControllerCommand.Previous )
      {
        controller.performPrevious();
      }
      else if( message.command === ControllerCommand.SkipBackward )
      {
        controller.performSkipBackward( settings.get( SettingKey.ControlsOverlay.Other.SkipBackwardAmount ) );
      }
      else if( message.command === ControllerCommand.SkipForward )
      {
        controller.performSkipForward( settings.get( SettingKey.ControlsOverlay.Other.SkipForwardAmount ) );
      }
      else if( message.command === ControllerCommand.Like )
      {
        controller.performLike();
      }
      else if( message.command === ControllerCommand.Unlike )
      {
        controller.performUnlike();
      }
      else if( message.command === ControllerCommand.Dislike )
      {
        controller.performDislike();
      }
      else if( message.command === ControllerCommand.Undislike )
      {
        controller.performUndislike();
      }
      else if( message.command === ControllerCommand.VolumeUp )
      {
        controller.performVolumeUp();
      }
      else if( message.command === ControllerCommand.VolumeDown )
      {
        controller.performVolumeDown();
      }
      else
      {
        console.warn( 'Unhandled controller command:', message.command, message );
      }
    }
    else
    {
      console.warn( 'Unhandled message:', message );
    }
  } );

  port.onDisconnect.addListener( ( p ) =>
  {
    window.clearTimeout( preventDisconnectTimeout );
    controllerPorts.delete( controller );
    controller.onUpdate.removeEventListener( onControllerUpdate );

    if( p.error )
    {
      console.error( 'Error caused controller port disonnection:', controllerId, controller, p );
      controller.stop();
      return;
    }

    try
    {
      console.log( 'Attempting to re-connect controller port:', controllerId, controller );
      connectController( controllerId, controller );
    }
    catch( e )
    {
      console.error( 'Failed to re-connect controller port:', controllerId, controller, e );
    }
  } );
}

function onControllerUrlMatch( controllerId: ControllerId, controller: Controller )
{
  console.log( 'Found matching controller:', controllerId, controller );

  if( !settings.get( CONTROLLERS[ controllerId ].enabledSetting ) )
  {
    console.log( 'Controller is not enabled:', controllerId );
    return;
  }

  connectController( controllerId, controller );
}

function onNoControllerUrlMatch()
{
  if( !settings.get( SettingKey.ControllersEnabled.GenericAudioVideo ) )
  {
    return;
  }

  const siteBlackList = settings.get( SettingKey.Other.SiteBlacklist ).map( ( s ) => s.toLocaleLowerCase() );
  const url = window.location.href.toLocaleLowerCase();
  if( siteBlackList.some( ( s ) => url.includes( s ) ) )
  {
    console.log( 'Blacklisted site:', url );
    return;
  }

  const mediaControllers = new Map<HTMLMediaElement, Controller>();

  function onMutation()
  {
    const mediaElements = new Set( Array.from( document.querySelectorAll<HTMLAudioElement | HTMLVideoElement>( 'audio, video' ) ) );
    const previousMediaElements = new Set( mediaControllers.keys() );

    for( const oldMedia of previousMediaElements )
    {
      if( mediaElements.has( oldMedia ) )
      {
        continue;
      }

      const controller = mediaControllers.get( oldMedia );
      if( controller )
      {
        controller.stop();
        controllerPorts.get( controller )?.disconnect();
        mediaControllers.delete( oldMedia );
      }
      else
      {
        console.warn( 'Unable to get controller for media:', oldMedia );
      }
    }

    for( const newMedia of mediaElements )
    {
      if( previousMediaElements.has( newMedia ) )
      {
        continue;
      }

      if( mediaControllers.size > settings.get( SettingKey.Other.MaximumGenericAudioVideoControllersPerPage ) )
      {
        break;
      }

      const controller = new GenericAudioVideoController( newMedia );
      mediaControllers.set( newMedia, controller );

      connectController( ControllerId.GenericAudioVideo, controller );
    }
  }

  new MutationObserver( onMutation ).observe( document.body, {
    subtree: true,
    childList: true,
  } );
  onMutation();
}

onReady( () =>
{
  const match = findMatchingController();
  if( match )
  {
    onControllerUrlMatch( ...match );
  }
  else
  {
    onNoControllerUrlMatch();
  }
} );

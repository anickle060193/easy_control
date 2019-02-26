import React from 'react';
import ReactDOM from 'react-dom';
import screenfull from 'screenfull';

import { Controller } from 'controllers/controller';
import MediaControllerOverlay from 'controllers/MediaControllerOverlay';

import { SettingKey, settings, Sites } from 'common/settings';

// tslint:disable:member-ordering
export abstract class MediaController extends Controller
{
  protected static controllerCount = 0;

  protected readonly media: HTMLMediaElement;
  protected readonly isVideo: boolean;
  protected readonly controlsParent: HTMLElement;
  protected readonly controllerNumber: number;

  protected allowFullscreen: boolean;
  protected fullscreen: boolean;

  constructor( name: Sites, media: HTMLMediaElement )
  {
    super( name );

    this.media = media;
    this.isVideo = this.media instanceof HTMLVideoElement;
    this.controlsParent = document.createElement( 'div' );
    this.controllerNumber = MediaController.controllerCount;

    MediaController.controllerCount++;

    this.allowPauseOnInactivity = !this.isVideo;

    this.allowFullscreen = screenfull && screenfull.enabled && this.media instanceof HTMLVideoElement;
    this.fullscreen = screenfull && screenfull.element === this.media;
  }

  protected initialize()
  {
    super.initialize();

    this.onUpdateControls();
  }

  private onUpdateControls()
  {
    if( this.controlsParent.parentElement !== document.body )
    {
      document.body.appendChild( this.controlsParent );
    }

    ReactDOM.render(
      <MediaControllerOverlay
        media={this.media}
        allowsFullscreen={this.allowFullscreen}
        fullscreen={this.fullscreen}
        onSkipBackward={this.onSkipBackwardScope}
        onPlay={this.onPlayScope}
        onPause={this.onPauseScope}
        onSkipForward={this.onSkipForwardScope}
        setFullscreen={this.setFullscreenScope}
      />,
      this.controlsParent
    );
  }

  protected onPortDisconnect()
  {
    super.onPortDisconnect();

    ReactDOM.unmountComponentAtNode( this.controlsParent );
  }

  public disconnect()
  {
    this.onPortDisconnect();
  }

  private setFullscreenScope = ( fullscreen: boolean ) =>
  {
    this.setFullscreen( fullscreen );
  }

  protected setFullscreen( fullscreen: boolean )
  {
    if( screenfull && screenfull.enabled )
    {
      if( fullscreen )
      {
        screenfull.request( this.media );
      }
      else
      {
        screenfull.exit();
      }
    }
  }

  private onSkipBackwardScope = () =>
  {
    this.onSkipBackward();
  }

  protected onSkipBackward()
  {
    this.media.currentTime -= settings.get( SettingKey.Controls.Other.SkipBackwardAmount );
  }

  protected onPlayPause = () =>
  {
    if( this.isPaused() )
    {
      this.play();
    }
    else
    {
      this.pause();
    }
  }

  private onSkipForwardScope = () =>
  {
    this.onSkipForward();
  }

  protected onSkipForward()
  {
    this.media.currentTime += settings.get( SettingKey.Controls.Other.SkipForwardAmount );
  }

  private onPlayScope = () =>
  {
    this.play();
  }

  private onPauseScope = () =>
  {
    this.pause();
  }

  protected playImpl()
  {
    this.media.play();
  }

  protected pauseImpl()
  {
    this.media.pause();
  }

  protected getProgress()
  {
    if( this.media.duration === 0 )
    {
      return 0;
    }
    else
    {
      return this.media.currentTime / this.media.duration;
    }
  }

  protected isPaused()
  {
    return this.media.paused;
  }

  protected volumeUp()
  {
    this.media.volume = Math.min( 1.0, this.media.volume + 0.05 );
  }

  protected volumeDown()
  {
    this.media.volume = Math.max( 0.0, this.media.volume - 0.05 );
  }

  public startPolling()
  {
    console.log( 'MediaController - Start polling' );

    if( !this.initialized )
    {
      throw new Error( 'Must initialize media controller before polling.' );
    }

    this.media.addEventListener( 'play', this.onPoll );
    this.media.addEventListener( 'pause', this.onPoll );
    this.media.addEventListener( 'playing', this.onPoll );
    this.media.addEventListener( 'timeupdate', this.onPoll );
  }

  public stopPolling()
  {
    console.log( 'MediaController - Stop polling' );

    this.media.removeEventListener( 'play', this.onPoll );
    this.media.removeEventListener( 'pause', this.onPoll );
    this.media.removeEventListener( 'playing', this.onPoll );
    this.media.removeEventListener( 'timeupdate', this.onPoll );
  }
}

type ControllerCreatorCallback = ( element: HTMLAudioElement | HTMLVideoElement ) => MediaController | null;

function registerNewMediaCallback( controllerCreatorCallback: ControllerCreatorCallback )
{
  type HTMLControllableElement = ( HTMLAudioElement | HTMLVideoElement ) & {
    [ 'easy-control--controller' ]: MediaController | undefined;
  };

  function addMedia( element: HTMLElement )
  {
    if( !( element instanceof HTMLAudioElement
      || element instanceof HTMLVideoElement ) )
    {
      return;
    }

    let controller = ( element as HTMLControllableElement )[ 'easy-control--controller' ];
    if( controller )
    {
      console.warn( 'Media found that already has controller.' );
      return;
    }

    let newController = controllerCreatorCallback( element );
    if( newController )
    {
      ( element as HTMLControllableElement )[ 'easy-control--controller' ] = newController;
    }
  }

  function removeMedia( element: HTMLElement )
  {
    let controller = ( element as HTMLControllableElement )[ 'easy-control--controller' ];
    if( !controller )
    {
      console.warn( 'Controller was not found for media.' );
      return;
    }

    controller.disconnect();
    delete ( element as HTMLControllableElement )[ 'easy-control--controller' ];
  }

  for( let element of Array.from( document.querySelectorAll<HTMLElement>( 'audio, video' ) ) )
  {
    addMedia( element );
  }

  let newMediaElementObserver = new MutationObserver( ( mutations ) =>
  {
    for( let mutation of mutations )
    {
      for( let addedNode of Array.from( mutation.addedNodes ) )
      {
        if( addedNode instanceof HTMLAudioElement
          || addedNode instanceof HTMLVideoElement )
        {
          addMedia( addedNode );
        }
        else if( addedNode instanceof HTMLElement )
        {
          for( let element of Array.from( addedNode.querySelectorAll<HTMLElement>( 'audio, video' ) ) )
          {
            addMedia( element );
          }
        }
      }

      for( let removedNode of Array.from( mutation.removedNodes ) )
      {
        if( removedNode instanceof HTMLAudioElement
          || removedNode instanceof HTMLVideoElement )
        {
          removeMedia( removedNode );
        }
        else if( removedNode instanceof HTMLElement )
        {
          for( let element of Array.from( removedNode.querySelectorAll<HTMLElement>( 'audio, video' ) ) )
          {
            removeMedia( element );
          }
        }
      }
    }
  } );

  newMediaElementObserver.observe( document.body, {
    childList: true,
    subtree: true
  } );
}

export function createMultiMediaListener( name: string, controllerCreatorCallback: ControllerCreatorCallback )
{
  registerNewMediaCallback( ( media ) =>
  {
    console.log( 'New Media Found:', name );

    let controller = controllerCreatorCallback( media );
    if( controller )
    {
      controller.startPolling();
    }
    return controller;
  } );
}

export function createSingleMediaListener( name: string, controllerCreatorCallback: ControllerCreatorCallback )
{
  let controller: MediaController | null = null;

  registerNewMediaCallback( ( media ) =>
  {
    console.log( 'New Media Found:', name );

    let newController = controllerCreatorCallback( media );

    if( newController )
    {
      if( controller )
      {
        console.log( 'Disconnecting Old Media:', name );
        controller.disconnect();
      }

      controller = newController;
      controller.startPolling();
    }

    return controller;
  } );
}

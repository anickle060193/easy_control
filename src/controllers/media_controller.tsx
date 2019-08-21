import React from 'react';
import ReactDOM from 'react-dom';
import screenfull from 'screenfull';

import { Controller } from 'controllers/controller';
import MediaControllerOverlay from 'controllers/MediaControllerOverlay';

import { SettingKey, settings, Sites } from 'common/settings';
import doc from 'common/doc';

const fullscreenStyle = document.createElement( 'style' );
fullscreenStyle.textContent = `
  *:-webkit-full-screen video
  {
    object-fit: contain;
    position: fixed !important;
    top: 0px !important;
    right: 0px !important;
    bottom: 0px !important;
    left: 0px !important;
    box-sizing: border-box !important;
    min-width: 0px !important;
    max-width: none !important;
    min-height: 0px !important;
    max-height: none !important;
    width: 100% !important;
    height: 100% !important;
    transform: none !important;
    margin: 0px !important;
  }
`;

// tslint:disable:member-ordering
export abstract class MediaController extends Controller
{
  protected static controllerCount = 0;

  protected readonly media: HTMLAudioElement | HTMLVideoElement;
  protected readonly isVideo: boolean;
  protected readonly controlsRoot: HTMLElement;
  protected readonly controllerNumber: number;

  protected allowFullscreen: boolean;
  protected mediaContainer: HTMLElement | null;

  constructor( name: Sites, media: HTMLAudioElement | HTMLVideoElement )
  {
    super( name );

    this.media = media;
    this.isVideo = this.media instanceof HTMLVideoElement;
    this.controlsRoot = document.createElement( 'div' );
    this.controllerNumber = MediaController.controllerCount;

    this.supportedOperations = {
      ...this.supportedOperations,
      playPause: true,
      volumeDown: true,
      volumeUp: true,
    };

    MediaController.controllerCount++;

    this.allowPauseOnInactivity = !this.isVideo;

    this.allowFullscreen = screenfull && screenfull.enabled && this.isVideo;
    this.mediaContainer = this.media.parentElement;

    if( screenfull )
    {
      screenfull.on( 'change', () =>
      {
        if( ( !screenfull || !screenfull.isFullscreen )
          && fullscreenStyle.parentElement !== null )
        {
          fullscreenStyle.remove();
        }
      } );
    }
  }

  public updateControls()
  {
    if( this.disconnected )
    {
      console.warn( 'Attempting to update controls of disconnected controller.' );
      return;
    }

    if( !( this.media instanceof HTMLVideoElement ) )
    {
      return;
    }

    if( this.controlsRoot.parentElement !== document.body )
    {
      document.body.appendChild( this.controlsRoot );
    }

    ReactDOM.render(
      <MediaControllerOverlay
        media={this.media}
        mediaContainer={this.mediaContainer}
        allowsFullscreen={this.allowFullscreen}
        onSkipBackward={this.onSkipBackwardScope}
        onPlay={this.onPlayScope}
        onPause={this.onPauseScope}
        onSkipForward={this.onSkipForwardScope}
        setFullscreen={this.setFullscreenScope}
      />,
      this.controlsRoot
    );
  }

  protected onPortDisconnect()
  {
    super.onPortDisconnect();

    ReactDOM.unmountComponentAtNode( this.controlsRoot );
    this.controlsRoot.remove();

    let elem = this.media as HTMLControllableElement;
    elem[ 'easy-control--controller' ] = undefined;
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
        if( this.mediaContainer )
        {
          screenfull.request( this.mediaContainer );
          document.body.append( fullscreenStyle );
        }
        else
        {
          console.error( 'Media container is null.' );
        }
      }
      else
      {
        if( screenfull.isFullscreen )
        {
          screenfull.exit();
          fullscreenStyle.remove();
        }
      }
    }
  }

  private onSkipBackwardScope = () =>
  {
    this.skipBackward();
  }

  protected skipBackward()
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
    this.skipForward();
  }

  protected skipForward()
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

  protected getBasicContentInfo()
  {
    return {
      ...super.getBasicContentInfo(),
      image: this.media instanceof HTMLVideoElement && this.media.poster ? this.media.poster : undefined
    };
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

  protected onStartPolling()
  {
    console.log( 'MediaController - Start polling' );

    this.updateControls();

    this.media.addEventListener( 'play', this.onPoll );
    this.media.addEventListener( 'pause', this.onPoll );
    this.media.addEventListener( 'playing', this.onPoll );
    this.media.addEventListener( 'timeupdate', this.onPoll );
  }

  protected onStopPolling()
  {
    console.log( 'MediaController - Stop polling' );

    this.media.removeEventListener( 'play', this.onPoll );
    this.media.removeEventListener( 'pause', this.onPoll );
    this.media.removeEventListener( 'playing', this.onPoll );
    this.media.removeEventListener( 'timeupdate', this.onPoll );
  }
}

type ControllerCreatorCallback = ( element: HTMLAudioElement | HTMLVideoElement ) => MediaController | null;

type HTMLControllableElement = ( HTMLAudioElement | HTMLVideoElement ) & {
  [ 'easy-control--controller' ]: MediaController | undefined;
};

function registerNewMediaCallback( controllerCreatorCallback: ControllerCreatorCallback )
{
  let previousMedia: Set<HTMLAudioElement | HTMLVideoElement> = new Set();

  function addMedia( element: HTMLElement )
  {
    if( !( element instanceof HTMLAudioElement
      || element instanceof HTMLVideoElement ) )
    {
      return;
    }

    let elem = element as HTMLControllableElement;

    let controller = elem[ 'easy-control--controller' ];
    if( controller )
    {
      controller.updateControls();
      return;
    }

    let newController = controllerCreatorCallback( element );
    if( newController )
    {
      elem[ 'easy-control--controller' ] = newController;
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

  function onUpdate()
  {
    let currentMediaElements = new Set( Array.from( document.querySelectorAll<HTMLAudioElement | HTMLVideoElement>( 'audio, video' ) ) );

    let allMediaElements = new Set<HTMLAudioElement | HTMLVideoElement>( [ ...currentMediaElements, ...previousMedia ] );

    for( let media of allMediaElements )
    {
      if( previousMedia.has( media )
        && !currentMediaElements.has( media ) )
      {
        removeMedia( media );
      }
      else if( !previousMedia.has( media )
        && currentMediaElements.has( media ) )
      {
        addMedia( media );
      }
    }

    for( let media of currentMediaElements )
    {
      let controllerMedia = media as HTMLControllableElement;
      let controller = controllerMedia[ 'easy-control--controller' ];
      if( controller )
      {
        controller.updateControls();
      }
    }

    previousMedia = currentMediaElements;
  }

  doc.addEventListener( 'change:src', onUpdate );

  onUpdate();
}

export function createMultiMediaListener( name: string, controllerCreatorCallback: ControllerCreatorCallback )
{
  registerNewMediaCallback( ( media ) =>
  {
    console.log( 'New Media Found:', name, media );

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
    console.log( 'New Media Found:', name, media );

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

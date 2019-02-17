import { Controller } from "./controller";
import { Settings } from "../common/settings";
import * as storage from '../common/storage';

const enum ControlIds
{
  Reset = 'media-control-overlay-reset',
  MuchSlower = 'media-control-overlay-much-slower',
  Slower = 'media-control-overlay-slower',
  SkipBackward = 'media-control-overlay-skip-backward',
  PlayPause = 'media-control-overlay-play-pause',
  SkipForward = 'media-control-overlay-skip-forward',
  Faster = 'media-control-overlay-faster',
  MuchFaster = 'media-control-overlay-much-faster',
  Loop = 'media-control-overlay-loop',
  Fullscreen = 'media-control-overlay-fullscreen',
  Remove = 'media-control-overlay-remove',
  Dragger = 'media-control-overlay-dragger'
}

class MediaController extends Controller
{
  static controllerCount = 0;

  media: HTMLMediaElement;
  isVideo: boolean;
  controlsParent: HTMLElement | null;
  controls: {[ key in ControlIds ]: HTMLElement } | null;
  controllerNumber: number;

  fullscreen: boolean;
  dragging: boolean;
  hasDragged: boolean;
  hovering: boolean;
  positionOfElement: HTMLElement | null;

  hideControlsOnIdleTimeout: number;
  observer: MutationObserver;

  constructor( name: string, media: HTMLMediaElement )
  {
    super( name );

    this.media = media;
    this.isVideo = this.media.nodeName === 'VIDEO';
    this.controls = null;
    this.controllerNumber = MediaController.controllerCount;

    MediaController.controllerCount++;

    this.allowPauseOnInactivity = !this.isVideo;

    this.fullscreen = false;
    this.dragging = false;
    this.hasDragged = false;
    this.hovering = false;
    this.positionOfElement = null;

    this.hideControlsOnIdleTimeout = 0;

    document.addEventListener( 'keydown', this.onKeyDown );

    if( MediaController.settings[ Settings.Controls.Other.DisplayControls ] )
    {
      this.initializeMediaControls();
    }

    this.observer = new MutationObserver( this.onSourceChanged );
    this.observer.observe( this.media, {
      attributes: true,
      attributeFilter: [ 'src' ]
    } );

    this.onSourceChanged();
  }

  e( eventName: string )
  {
    return eventName + '.' + this.controllerNumber;
  }

  async initializeMediaControls()
  {
    if( this.controls )
    {
      console.warn( 'Controls have already been initialized.' );
      return;
    }

    let response = await fetch( chrome.extension.getURL( 'media_control_overlay.html' ) )
    if( !response.ok )
    {
      throw new Error( 'Failed to retrieve media control overlay.' );
    }
    let responseText = await response.text();

    if( this.disconnected )
    {
      return;
    }

    let template = document.createElement( 'template' );
    template.innerHTML = responseText;

    this.controlsParent = template.content.firstElementChild as HTMLElement;

    this.controls = {
      [ ControlIds.Reset ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-reset' )!,
      [ ControlIds.MuchSlower ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-much-slower' )!,
      [ ControlIds.Slower ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-slower' )!,
      [ ControlIds.SkipBackward ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-skip-backward' )!,
      [ ControlIds.PlayPause ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-play-pause' )!,
      [ ControlIds.SkipForward ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-skip-forward' )!,
      [ ControlIds.Faster ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-faster' )!,
      [ ControlIds.MuchFaster ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-much-faster' )!,
      [ ControlIds.Loop ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-loop' )!,
      [ ControlIds.Fullscreen ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-fullscreen' )!,
      [ ControlIds.Remove ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-remove' )!,
      [ ControlIds.Dragger ]: this.controlsParent.querySelector<HTMLElement>( '#media-control-overlay-dragger' )!
    };

    this.attachControls();

    this.hideControls();
    this.loop( this.media.loop );

    this.controlsParent.addEventListener( 'dblclick', ( e ) =>
    {
      e.stopPropagation();
      e.preventDefault();
    } );

    const clickHandlers: {[ key in ControlIds ]: () => void } = {
      [ ControlIds.Reset ]: this.onPlaybackReset,
      [ ControlIds.MuchSlower ]: this.onPlaybackMuchSlower,
      [ ControlIds.Slower ]: this.onPlaybackSlower,
      [ ControlIds.SkipBackward ]: this.onSkipBackward,
      [ ControlIds.PlayPause ]: this.onPlayPause,
      [ ControlIds.SkipForward ]: this.onSkipForward,
      [ ControlIds.Faster ]: this.onPlaybackFaster,
      [ ControlIds.MuchFaster ]: this.onPlaybackMuchFaster,
      [ ControlIds.Loop ]: () => this.loop( !this.media.loop ),
      [ ControlIds.Fullscreen ]: () => this.setFullscreen( !this.fullscreen ),
      [ ControlIds.Remove ]: () => this.removeControls(),
      [ ControlIds.Dragger ]: () => null
    };

    this.controlsParent.addEventListener( 'click', ( e ) =>
    {
      let id = ( e.target as HTMLElement ).id;
      if( id in clickHandlers )
      {
        clickHandlers[ id ]();
      }
    } );

    this.media.addEventListener( 'ratechange', this.onMediaRateChange );
    this.media.addEventListener( 'playing', this.onMediaPlaying );
    this.media.addEventListener( 'pause', this.onMediaPause );

    /*
    $( this.media )
      .on( this.e( 'loopchange' ), $.proxy( function( e, loop )
      {
        this.loop( loop );
      }, this ) )
    */

    this.controlsParent.addEventListener( 'mouseenter', this.onShowControls );
    this.controlsParent.addEventListener( 'mouseleave', this.onHideControls );

    if( this.isVideo )
    {
      this.media.addEventListener( 'mouseenter', this.onShowControls );
      this.media.addEventListener( 'mouseleave', this.onHideControls );

      document.addEventListener( 'webkitfullscreenchange', this.onFullscreenChange );
    }
    else
    {
      document.body.addEventListener( 'mouseenter', this.onShowControls );
      document.body.addEventListener( 'mouseleave', this.onHideControls );
    }
  }

  onMediaRateChange = () =>
  {
    if( this.controls )
    {
      this.controls[ Controls.Reset ].innerText = this.media.playbackRate.toFixed( 1 );
    }
  }

  onMediaPlaying = () =>
  {
    if( this.controls )
    {
      this.controls[ Controls.PlayPause ].title = 'Pause';
      this.controls[ Controls.PlayPause ].classList.remove( 'easy-control-media-control-play' );
      this.controls[ Controls.PlayPause ].classList.add( 'easy-control-media-control-pause' );
    }
  }

  onMediaPause = () =>
  {
    if( this.controls )
    {
      this.controls[ Controls.PlayPause ].title = 'Play';
      this.controls[ Controls.PlayPause ].classList.remove( 'easy-control-media-control-pause' );
      this.controls[ Controls.PlayPause ].classList.add( 'easy-control-media-control-play' );
    }
  }

  onShowControls = () =>
  {
    this.hovering = true;
    this.showControls();
  }

  onHideControls = () =>
  {
    this.hovering = false;
    this.hideControls( false );
  }

  removeControls()
  {
    if( this.controlsParent )
    {
      this.controlsParent.remove();
      this.controls = null;

      $( this.positionOfElement )
        .off( this.e( 'move' ) )
        .off( this.e( 'visible' ) );
      this.positionOfElement = null;

      this.media.removeEventListener( 'mouseenter', this.onShowControls )
      this.media.removeEventListener( 'mouseleave', this.onHideControls )
      this.media.removeEventListener( 'ratechange', this.onMediaRateChange );
      this.media.removeEventListener( 'playing', this.onMediaPlaying )
      this.media.removeEventListener( 'pause', this.onMediaPause );
      // this.media.removeEventListener( 'loopchange', );

      document.removeEventListener( 'webkitfullscreenchange', this.onFullscreenChange );
      document.removeEventListener( 'mousemove', this.handleMouseMove );

      document.body.removeEventListener( 'mouseenter', this.onShowControls )
      document.body.removeEventListener( 'mouseleave', this.onHideControls )
    }
  }

  onSourceChanged = () =>
  {
    console.log( 'Source Changed' );

    let playbackRates = storage.get( 'easy_control.playbackRate' ) as Partial<{ [ key: string ]: number }>;
    let playbackRate = playbackRates[ window.location.hostname ];
    if( playbackRate !== undefined )
    {
      console.log( 'Setting Playback Rate: ' + playbackRate );
      this.media.playbackRate = playbackRate;
    }

    if( this.controls )
    {
      this.loop( this.media.loop );
    }
  }

  disconnect()
  {
    super.disconnect();

    this.removeControls();
    document.removeEventListener( 'keydown', this.onKeyDown );
    this.observer.disconnect();
  }

  showControls()
  {
    if( !this.controlsParent || !this.controls )
    {
      throw new Error( 'Controls not defined.' );
    }

    const shortcutStr = ( text: string, shortcut?: string ) => ( text + ( shortcut ? ` [${shortcut}]` : '' ) );

    this.controlsParent.hidden = false;
    Array.from( this.controlsParent.children ).forEach( ( child ) => ( child as HTMLElement ).hidden = true );

    this.controls[ ControlIds.Reset ].hidden = false;
    this.controls[ ControlIds.Reset ].title = shortcutStr( 'Reset Playback Speed', Controller.settings[ Settings.Controls.MediaControls.Reset ] );

    if( this.hovering )
    {
      this.controls[ ControlIds.Remove ].hidden = false;
      this.controls[ ControlIds.Dragger ].hidden = false;

      let balh: {[ key in ControlIds, Controls.Reset ]: Controls } = {
        [ ControlIds.MuchSlower ]: Controls.MuchSlower,
        [ ControlIds.Slower ]: Controls.Slower,
        [ ControlIds.SkipBackward ]: Controls.SkipBackward,
        [ ControlIds.PlayPause ]: Controls.PlayPause,
        [ ControlIds.SkipForward ]: Controls.SkipForward,
        [ ControlIds.Faster ]: Controls.Faster,
        [ ControlIds.MuchFaster ]: Controls.MuchFaster,
        [ ControlIds.Loop ]: Controls.Loop,
        [ ControlIds.Fullscreen ]: Controls.Fullscreen,
      };

      shortcut = Controller.settings[ Settings.Controls.MediaControls.MuchSlower ];
      this.controls.find( '#media-control-overlay-much-slower' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.MuchSlower ] )
        .prop( 'title', 'Much Slower' + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.Slower ];
      this.controls.find( '#media-control-overlay-slower' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.Slower ] )
        .prop( 'title', 'Slower' + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.SkipBackward ];
      let amount = Controller.settings[ Settings.Controls.SkipBackwardAmount ];
      this.controls.find( '#media-control-overlay-skip-backward' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.SkipBackward ] )
        .prop( 'title', `Skip Backward ${amount} seconds` + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.PlayPause ];
      this.controls.find( '#media-control-overlay-play-pause' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.PlayPause ] )
        .prop( 'title', ( this.isPaused() ? 'Play' : 'Pause' ) + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.SkipForward ];
      amount = Controller.settings[ Settings.Controls.SkipForwardAmount ];
      this.controls.find( '#media-control-overlay-skip-forward' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.SkipForward ] )
        .prop( 'title', `Skip Forward ${amount} seconds` + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.Faster ];
      this.controls.find( '#media-control-overlay-faster' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.Faster ] )
        .prop( 'title', 'Faster' + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.MuchFaster ];
      this.controls.find( '#media-control-overlay-much-faster' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.MuchFaster ] )
        .prop( 'title', 'Much Faster' + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.Loop ];
      this.controls.find( '#media-control-overlay-loop' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.Loop ] )
        .prop( 'title', ( this.media.loop ? 'Do not loop' : 'Loop' ) + ( shortcut ? ` [${shortcut}]` : '' ) );

      shortcut = Controller.settings[ Settings.Controls.MediaControls.Fullscreen ];
      this.controls.find( '#media-control-overlay-fullscreen' )
        .toggle( Controller.settings[ Settings.Controls.OverlayControls.Fullscreen ] )
        .prop( 'title', ( this.fullscreen ? 'Exit Fullscreen' : 'Fullscreen' ) + ( shortcut ? ` [${shortcut}]` : '' ) );
    }
  }

  hideControls( hideAll = false )
  {
    if( !this.dragging )
    {
      if( hideAll || !Controller.settings[ Settings.Controls.AlwaysDisplayPlaybackSpeed ] )
      {
        this.controls.hide();
      }
      else
      {
        this.controls.find( '.easy-control-media-control' ).hide();
      }
    }
  }

  attachControls()
  {
    if( this.positionOfElement )
    {
      $( this.positionOfElement ).off( this.e( 'move' ) );
      $( this.positionOfElement ).off( this.e( 'visible' ) );
    }

    this.hasDragged = false;
    this.fullscreen = false;

    let appendToElement = document.body;
    this.positionOfElement = this.media;

    if( !this.isVideo )
    {
      this.positionOfElement = document.body;
    }
    else if( document.webkitFullscreenElement
      && $( this.media ).closest( document.webkitFullscreenElement ).length > 0 )
    {
      console.log( 'Attaching to Fullscreen' );
      this.fullscreen = true;
      if( document.webkitFullscreenElement === this.media )
      {
        appendToElement = document.body;
      }
      else
      {
        appendToElement = document.webkitFullscreenElement;
      }
      this.positionOfElement = document.webkitFullscreenElement;
    }

    if( this.fullscreen )
    {
      $( '#media-control-overlay-fullscreen' )
        .prop( 'title', 'Exit Fullscreen' )
        .removeClass( 'easy-control-media-control-fullscreen' )
        .addClass( 'easy-control-media-control-exit-fullscreen' );
    }
    else
    {
      $( '#media-control-overlay-fullscreen' )
        .prop( 'title', 'Fullscreen' )
        .removeClass( 'easy-control-media-control-exit-fullscreen' )
        .addClass( 'easy-control-media-control-fullscreen' );
    }

    $( document ).on( this.e( 'mousemove' ), $.proxy( this.handleMouseMove, this ) );

    this.controls
      .detach()
      .appendTo( appendToElement )
      .css( 'zIndex', Number.MAX_SAFE_INTEGER );

    this.controls.draggable( {
      handle: '#media-control-overlay-dragger',
      containment: this.positionOfElement,
      start: $.proxy( function()
      {
        this.dragging = true;
        this.hasDragged = true;
      }, this ),
      stop: $.proxy( function()
      {
        this.dragging = false;
      }, this )
    } );

    $( this.positionOfElement ).on( this.e( 'move' ), $.proxy( function()
    {
      if( !this.hasDragged )
      {
        this.repositionControls();
      }
    }, this ) );

    this.controls.toggle( $( this.positionOfElement ).is( ':visible' ) );
    $( this.positionOfElement ).on( this.e( 'visible' ), $.proxy( function( event, visible )
    {
      console.log( 'Visible: ' + visible );
      this.controls.toggle( visible );
      this.repositionControls();
    }, this ) );

    this.repositionControls();
  }

  repositionControls()
  {
    this.controls
      .position( {
        my: 'left top',
        at: 'left+6 top+6',
        of: this.positionOfElement,
        collision: 'none'
      } );
  }

  onFullscreenChange = () =>
  {
    this.attachControls();
  }

  handleMouseMove( event )
  {
    window.clearTimeout( this.hideControlsOnIdleTimeout );
    this.hideControlsOnIdleTimeout = null;

    if( this.controls )
    {
      if( this.hovering )
      {
        this.showControls();
      }

      if( Controller.settings[ Settings.Controls.HideControlsWhenIdle ] )
      {
        let timeout = Controller.settings[ Settings.Controls.HideControlsIdleTime ] * 1000;
        this.hideControlsOnIdleTimeout = setTimeout( $.proxy( function()
        {
          if( this.controls )
          {
            this.hideControls( true );
          }
        }, this ), timeout );
      }
    }
  }

  onKeyDown = ( event: KeyboardEvent ) =>
  {
    if( $( this.media ).closest( event.target ).length > 0
      || !this.isVideo )
    {
      let shortcut = Common.getKeyboardShortcut( event.originalEvent );

      if( !shortcut )
      {
        return true;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.MuchSlower ] )
      {
        this.playbackMuchSlower();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Slower ] )
      {
        this.playbackSlower();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.SkipBackward ] )
      {
        this.skipBackward();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.PlayPause ] )
      {
        this.playPause();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.SkipForward ] )
      {
        this.skipForward();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Faster ] )
      {
        this.playbackFaster();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.MuchFaster ] )
      {
        this.playbackMuchFaster();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Reset ] )
      {
        this.resetControls();
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Loop ] )
      {
        this.loop( !this.media.loop );
        return false;
      }
      else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Fullscreen ] )
      {
        this.setFullscreen( !this.fullscreen );
        return false;
      }
    }
  }

  resetControls()
  {
    if( Controller.settings[ Settings.Controls.DisplayControls ] )
    {
      if( this.controls === null )
      {
        this.initializeMediaControls();
      }
      else
      {
        this.hasDragged = false;
        this.repositionControls();
      }
    }
    this.playbackReset();
  }

  onPlaybackReset = () =>
  {
    this.setPlaybackRate( 1.0 );
  }

  onPlaybackMuchSlower = () =>
  {
    this.setPlaybackRate( this.media.playbackRate - 0.5 );
  }

  onPlaybackSlower = () =>
  {
    this.setPlaybackRate( this.media.playbackRate - 0.1 );
  }

  onSkipBackward = () =>
  {
    this.media.currentTime -= Controller.settings[ Settings.Controls.SkipBackwardAmount ];
  }

  onPlayPause = () =>
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

  onSkipForward = () =>
  {
    this.media.currentTime += Controller.settings[ Settings.Controls.SkipForwardAmount ];
  }

  onPlaybackFaster = () =>
  {
    this.setPlaybackRate( this.media.playbackRate + 0.1 );
  }

  onPlaybackMuchFaster = () =>
  {
    this.setPlaybackRate( this.media.playbackRate + 0.5 );
  }

  setPlaybackRate( playbackRate )
  {
    playbackRate = Common.limit( playbackRate, 0, 16 );
    if( this.media.playbackRate !== playbackRate )
    {
      this.media.playbackRate = playbackRate;

      let playbackRates = SessionStorage.get( 'easy_control.playbackRate' );
      playbackRates[ window.location.hostname ] = this.media.playbackRate;
      SessionStorage.set( 'easy_control.playbackRate', playbackRates );
    }
  }

  loop( loop )
  {
    this.media.loop = loop;

    if( this.media.loop )
    {
      $( '#media-control-overlay-loop' )
        .prop( 'title', 'Do not loop' )
        .removeClass( 'easy-control-media-control-loop' )
        .addClass( 'easy-control-media-control-no-loop' );
    }
    else
    {
      $( '#media-control-overlay-loop' )
        .prop( 'title', 'Loop' )
        .removeClass( 'easy-control-media-control-no-loop' )
        .addClass( 'easy-control-media-control-loop' );
    }
  }

  setFullscreen( fullscreen )
  {
    if( fullscreen !== this.fullscreen )
    {
      if( fullscreen )
      {
        if( this.media.webkitRequestFullscreen )
        {
          this.media.webkitRequestFullscreen();
          this.handleFullscreenChange();
        }
      }
      else
      {
        if( document.webkitExitFullscreen )
        {
          document.webkitExitFullscreen();
          this.handleFullscreenChange();
        }
      }
    }
  }

  _play()
  {
    this.media.play();
  }

  _pause()
  {
    this.media.pause();
  }

  getProgress()
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

  isPaused()
  {
    return this.media.paused;
  }

  volumeUp()
  {
    this.media.volume = Math.min( 1.0, this.media.volume + 0.05 );
  }

  volumeDown()
  {
    this.media.volume = Math.max( 0.0, this.media.volume - 0.05 );
  }

  startPolling()
  {
    console.log( 'MediaController - Start polling' );

    if( !this.initialized )
    {
      throw 'Must initialize media controller before polling.';
    }

    $( this.media ).on( 'play pause playing timeupdate', $.proxy( this.poll, this ) );
  }

  stopPolling()
  {
    console.log( 'MediaController - Stop polling' );
    $( this.media ).off( 'play pause playing timeupdate' );
  }
}

MediaController.onNewMedia = ( function()
{
  function addMedia( element, controllerCreatorCallback )
  {
    let elem = $( element );
    if( !elem.data( 'controller' ) )
    {
      let controller = controllerCreatorCallback( element );
      elem.data( 'controller', controller );
    }
    else
    {
      console.warn( 'Media found that already has controller.' );
    }
  }

  function removeMedia( element )
  {
    console.log( 'Media removed' );
    let elem = $( element );
    let controller = elem.data( 'controller' );
    if( controller )
    {
      controller.disconnect();
      elem.removeData( 'controller' );
    }
    else
    {
      console.warn( 'Controller was not found for media.' );
    }
  }

  return function( controllerCreatorCallback )
  {
    $( 'audio, video' ).each( function()
    {
      addMedia( this, controllerCreatorCallback );
    } );

    let newMediaElementObserver = new MutationObserver( function( mutations )
    {
      mutations.forEach( function( mutation )
      {
        mutation.addedNodes.forEach( function( node )
        {
          if( node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO' )
          {
            addMedia( node, controllerCreatorCallback );
          }
          else
          {
            $( node ).find( 'audio, video' ).each( function()
            {
              addMedia( this, controllerCreatorCallback );
            } );
          }
        } );

        mutation.removedNodes.forEach( function( node )
        {
          if( node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO' )
          {
            removeMedia( node );
          }
          else
          {
            $( node ).find( 'audio, video' ).each( function()
            {
              removeMedia( this );
            } );
          }
        } );
      } );
    } );
    newMediaElementObserver.observe( document.body, {
      childList: true,
      subtree: true
    } );
  };
} )();


MediaController.createMultiMediaListener = function( name, controllerCreatorCallback )
{
  MediaController.onNewMedia( function( media )
  {
    console.log( name + ' - New Media Found' );
    let controller = controllerCreatorCallback( media );
    if( controller )
    {
      controller.startPolling();
    }
    return controller;
  } );
};


MediaController.createSingleMediaListener = function( name, controllerCreatorCallback )
{
  let controller = null;
  MediaController.onNewMedia( function( media )
  {
    console.log( name + ' - New Media Found' );

    let tempController = controllerCreatorCallback( media );

    if( tempController )
    {
      if( controller )
      {
        console.log( name + ' - Disconnecting Old Media' );
        controller.disconnect();
      }

      controller = tempController;
      controller.startPolling();
    }
    return controller;
  } );
};

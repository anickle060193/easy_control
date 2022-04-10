import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box, Button, IconButton, Paper, Popper, SvgIconProps, Tooltip } from '@mui/material';
import { Close, Forward, Fullscreen, FullscreenExit, KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Pause, PlayArrow, Repeat, SkipNext, SkipPrevious } from '@mui/icons-material';

import { EasyControlThemeProvider } from '../common/components/EasyControlThemeProvider';
import { UpdateContentMessage } from '../common/contentMessages';
import settings, { SettingKey } from '../common/settings';

import Controller from './controller';

interface ControlButtonProps
{
  className?: string;
  label: string;
  icon: React.ComponentType<SvgIconProps>;
  enabled: boolean;
  visible: boolean;
  onClick: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ( { className, label, icon: IconComponent, enabled, visible, onClick } ) =>
{
  if( !visible )
  {
    return null;
  }

  return (
    <Tooltip title={label}>
      <div className={className}>
        <IconButton
          onClick={onClick}
          disabled={!enabled}
          size="small"
        >
          <IconComponent fontSize="small" />
        </IconButton>
      </div>
    </Tooltip>
  );
};

interface Props
{
  controller: Controller;
  video: HTMLVideoElement;
  container: HTMLElement;
  playing: boolean;
  canSkipBackward: boolean;
  canSkipForward: boolean;
  canFullscreen: boolean;
}

function getSettingsState()
{
  return {
    displayControls: settings.get( SettingKey.ControlsOverlay.Other.DisplayControls ),
    alwaysDisplayPlaybackRate: settings.get( SettingKey.ControlsOverlay.Other.AlwaysDisplayPlaybackSpeed ),
    hideControlsWhenIdle: settings.get( SettingKey.ControlsOverlay.Other.HideControlsWhenIdle ),
    hideControlsIdleTime: settings.get( SettingKey.ControlsOverlay.Other.HideControlsIdleTime ),
    visible: {
      reset: settings.get( SettingKey.ControlsOverlay.Visible.Reset ),
      muchSlower: settings.get( SettingKey.ControlsOverlay.Visible.MuchSlower ),
      slower: settings.get( SettingKey.ControlsOverlay.Visible.Slower ),
      skipBackward: settings.get( SettingKey.ControlsOverlay.Visible.SkipBackward ),
      playPause: settings.get( SettingKey.ControlsOverlay.Visible.PlayPause ),
      skipForward: settings.get( SettingKey.ControlsOverlay.Visible.SkipForward ),
      faster: settings.get( SettingKey.ControlsOverlay.Visible.Faster ),
      muchFaster: settings.get( SettingKey.ControlsOverlay.Visible.MuchFaster ),
      loop: settings.get( SettingKey.ControlsOverlay.Visible.Loop ),
      fullscreen: settings.get( SettingKey.ControlsOverlay.Visible.Fullscreen ),
    },
  };
}

export const ControlsOverlay: React.FC<Props> = React.memo( ( { controller, video, container, playing, canSkipBackward, canSkipForward, canFullscreen } ) =>
{
  const [ controlsSettings, setControlsSettings ] = React.useState( getSettingsState );

  const [ hoveringControls, setHoveringControls ] = React.useState( false );
  const [ hoveringVideo, setHoveringVideo ] = React.useState( false );
  const [ closed, setClosed ] = React.useState( false );
  const [ idle, setIdle ] = React.useState( false );

  const [ playbackRate, setPlaybackRate ] = React.useState( 1.0 );
  const [ looping, setLooping ] = React.useState( false );
  const [ isFullscreen, setIsFullscreen ] = React.useState( false );

  React.useEffect( () =>
  {
    function onSettingsChange()
    {
      setControlsSettings( getSettingsState() );
    }

    settings.onInitialized.addEventListener( onSettingsChange );
    settings.onChanged.addEventListener( onSettingsChange );

    return () =>
    {
      settings.onInitialized.removeEventListener( onSettingsChange );
      settings.onChanged.removeEventListener( onSettingsChange );
    };
  }, [] );

  const idleTimeoutRef = React.useRef<number>();
  React.useEffect( () =>
  {
    function onMouseMove()
    {
      setIdle( false );

      window.clearTimeout( idleTimeoutRef.current );

      idleTimeoutRef.current = window.setTimeout( () =>
      {
        setIdle( true );
      }, controlsSettings.hideControlsIdleTime * 1000 );
    }

    onMouseMove();
    document.addEventListener( 'mousemove', onMouseMove, { passive: true } );

    return () =>
    {
      window.clearTimeout( idleTimeoutRef.current );
      document.removeEventListener( 'mousemove', onMouseMove );
    };
  }, [ controlsSettings.hideControlsIdleTime ] );

  React.useEffect( () =>
  {
    function onMouseEnter()
    {
      setHoveringVideo( true );
    }

    function onMouseLeave()
    {
      setHoveringVideo( false );
    }

    video.addEventListener( 'mouseenter', onMouseEnter );
    video.addEventListener( 'mouseleave', onMouseLeave );

    return () =>
    {
      video.removeEventListener( 'mouseenter', onMouseEnter );
      video.removeEventListener( 'mouseleave', onMouseLeave );
    };
  }, [ video ] );

  const updateVideoState = React.useCallback( () =>
  {
    setPlaybackRate( video.playbackRate );
    setLooping( video.loop );
    setIsFullscreen( controller.isFullscreen() );
  }, [ video, controller ] );

  React.useEffect( () =>
  {
    document.addEventListener( 'fullscreenchange', updateVideoState );
    document.addEventListener( 'fullscreenerror', updateVideoState );

    video.addEventListener( 'loadstart', updateVideoState );

    updateVideoState();

    return () =>
    {
      document.removeEventListener( 'fullscreenchange', updateVideoState );
      document.removeEventListener( 'fullscreenerror', updateVideoState );

      video.removeEventListener( 'loadstart', updateVideoState );
    };
  }, [ video, updateVideoState ] );

  function setVideoPlaybackRate( playbackRate: number )
  {
    video.playbackRate = Math.max( 0, playbackRate );

    updateVideoState();
  }

  function incrementPlaybackRate( increment: number )
  {
    setVideoPlaybackRate( playbackRate + increment );
  }

  function onResetPlaybackSpeed()
  {
    setVideoPlaybackRate( video.defaultPlaybackRate ?? 1.0 );
  }

  function onMuchSlower()
  {
    incrementPlaybackRate( -0.5 );
  }

  function onSlower()
  {
    incrementPlaybackRate( -0.1 );
  }

  function onSkipBackward()
  {
    controller.performSkipBackward();
  }

  function onPlay()
  {
    controller.performPlay();
  }

  function onPause()
  {
    controller.performPause();
  }

  function onSkipForward()
  {
    controller.performSkipForward();
  }

  function onFaster()
  {
    incrementPlaybackRate( 0.1 );
  }

  function onMuchFaster()
  {
    incrementPlaybackRate( 0.5 );
  }

  function onLoop()
  {
    video.loop = !looping;

    updateVideoState();
  }

  function onFullscreen()
  {
    if( controller.isFullscreen() )
    {
      controller.performExitFullscreen();
    }
    else
    {
      controller.performEnterFullscreen();
    }
  }

  const open = (
    controlsSettings.displayControls
    && !closed
    && !( controlsSettings.hideControlsWhenIdle && idle )
    && ( hoveringControls || hoveringVideo || controlsSettings.alwaysDisplayPlaybackRate )
  );

  return (
    <Popper
      sx={{
        zIndex: 1000000,
        padding: 1,
      }}
      open={open}
      anchorEl={video}
      placement="top-start"
      container={container}
      modifiers={[
        {
          name: 'flip',
          enabled: false,
        },
        {
          name: 'inner',
          enabled: true,
          options: {
            order: 1,
          },
        },
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            boundariesElement: 'viewport',
            order: 2,
          },
        },
      ]}
    >
      <Paper
        sx={{
          padding: [ 0.5, 1 ],
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...( !hoveringControls && {
            opacity: 0.2,
          } ),
        }}
        onMouseEnter={() => setHoveringControls( true )}
        onMouseLeave={() => setHoveringControls( false )}
        onClick={( e ) =>
        {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }}
        onDoubleClick={( e ) =>
        {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }}
        onMouseDown={( e ) =>
        {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }}
      >
        <Tooltip title="Reset Playback Rate">
          <Button
            sx={{
              padding: 0,
              minWidth: 'unset',
            }}
            variant="text"
            onClick={onResetPlaybackSpeed}
          >
            {playbackRate.toFixed( 1 )}
          </Button>
        </Tooltip>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            ...( !hoveringControls && {
              display: 'none',
            } ),
          }}
        >
          <ControlButton
            label="Much Slower"
            icon={KeyboardDoubleArrowLeft}
            enabled={true}
            visible={controlsSettings.visible.muchSlower}
            onClick={onMuchSlower}
          />
          <ControlButton
            label="Slower"
            icon={KeyboardArrowLeft}
            enabled={true}
            visible={controlsSettings.visible.slower}
            onClick={onSlower}
          />
          <ControlButton
            label="Skip Backward"
            icon={SkipPrevious}
            enabled={canSkipBackward}
            visible={controlsSettings.visible.skipBackward}
            onClick={onSkipBackward}
          />
          {playing ? (
            <ControlButton
              label="Pause"
              icon={Pause}
              enabled={true}
              visible={controlsSettings.visible.playPause}
              onClick={onPause}
            />
          ) : (
            <ControlButton
              label="Play"
              icon={PlayArrow}
              enabled={true}
              visible={controlsSettings.visible.playPause}
              onClick={onPlay}
            />
          )}
          <ControlButton
            label="Skip Forward"
            icon={SkipNext}
            enabled={canSkipForward}
            visible={controlsSettings.visible.skipForward}
            onClick={onSkipForward}
          />
          <ControlButton
            label="Faster"
            icon={KeyboardArrowRight}
            enabled={true}
            visible={controlsSettings.visible.faster}
            onClick={onFaster}
          />
          <ControlButton
            label="Much Faster"
            icon={KeyboardDoubleArrowRight}
            enabled={true}
            visible={controlsSettings.visible.muchFaster}
            onClick={onMuchFaster}
          />
          {looping ? (
            <ControlButton
              label="Stop Looping"
              icon={Forward}
              enabled={true}
              visible={controlsSettings.visible.loop}
              onClick={onLoop}
            />
          ) : (
            <ControlButton
              label="Loop"
              icon={Repeat}
              enabled={true}
              visible={controlsSettings.visible.loop}
              onClick={onLoop}
            />
          )}
          {isFullscreen ? (
            <ControlButton
              label="Exit Fullscreen"
              icon={FullscreenExit}
              enabled={canFullscreen}
              visible={controlsSettings.visible.fullscreen}
              onClick={onFullscreen}
            />
          ) : (
            <ControlButton
              label="Fullscreen"
              icon={Fullscreen}
              enabled={canFullscreen}
              visible={controlsSettings.visible.fullscreen}
              onClick={onFullscreen}
            />
          )}
          <ControlButton
            label="Remove Controls"
            icon={Close}
            enabled={true}
            visible={true}
            onClick={() => setClosed( true )}
          />
        </Box>
      </Paper>
    </Popper>
  );
} );

interface Root
{
  dom: HTMLElement;
  react: ReactDOM.Root;
}

export class Controls
{
  private root: Root | null = null;

  constructor(
    private readonly parent: Controller
  )
  {
  }

  private getRoot(): Root
  {
    if( !this.root )
    {
      const dom = document.createElement( 'div' );
      this.root = {
        dom: dom,
        react: ReactDOM.createRoot( dom ),
      };
    }
    return this.root;
  }

  public remove(): void
  {
    if( this.root )
    {
      this.root.react.unmount();
      this.root.dom.remove();
      this.root = null;
    }
  }

  public update( media: HTMLMediaElement | null, container: HTMLElement | null, updateMessage: UpdateContentMessage ): void
  {
    if( !( media instanceof HTMLVideoElement ) )
    {
      this.remove();
      return;
    }

    if( !settings.get( SettingKey.ControlsOverlay.Other.DisplayControls ) )
    {
      this.remove();
      return;
    }

    const root = this.getRoot();

    if( root.dom.parentElement !== document.body )
    {
      console.log( 'Appending controls root:', root );
      document.body.appendChild( root.dom );
    }

    root.react.render(
      <React.StrictMode>
        <EasyControlThemeProvider forceDarkMode={true}>
          <ControlsOverlay
            controller={this.parent}
            video={media}
            container={container ?? document.body}
            playing={updateMessage.status.playing}
            canSkipBackward={updateMessage.capabilities.skipBackward}
            canSkipForward={updateMessage.capabilities.skipForward}
            canFullscreen={updateMessage.capabilities.fullscreen}
          />
        </EasyControlThemeProvider>
      </React.StrictMode>
    );
  }
}
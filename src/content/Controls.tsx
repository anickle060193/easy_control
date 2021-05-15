import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Button, createStyles, IconButton, makeStyles, Paper, Popper, SvgIconProps, Tooltip } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/Pause';
import MuchSlowerIcon from '@material-ui/icons/FastRewind';
import SkipBackwardIcon from '@material-ui/icons/Replay10';
import SkipForwardIcon from '@material-ui/icons/Forward10';
import FasterIcon from '@material-ui/icons/PlayArrow';
import MuchFasterIcon from '@material-ui/icons/FastForward';
import LoopIcon from '@material-ui/icons/Repeat';
import NoLoopIcon from '@material-ui/icons/Forward';
// import FullscreenIcon from '@material-ui/icons/Fullscreen';
// import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import RemoveIcon from '@material-ui/icons/Clear';

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
  onClick: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ( { className, label, icon: IconComponent, enabled, onClick } ) =>
{
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

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    zIndex: 1000000,
    padding: theme.spacing( 1 ),
  },
  paper: {
    padding: theme.spacing( 0.5, 1 ),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fadeControls: {
    opacity: 0.2,
  },
  playbackRate: {
    padding: 0,
    minWidth: 'unset',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hideActions: {
    display: 'none',
  },
  controlButton: {
  },
} ) );

interface Props
{
  controller: Controller;
  video: HTMLVideoElement;
  playing: boolean;
  canSkipBackward: boolean;
  canSkipForward: boolean;
}

interface SettingsState
{
  displayControls: boolean;
  alwaysDisplayPlaybackRate: boolean;
  hideConrolsWhenIdle: boolean;
  hideControlsIdleTime: number;
}

function getSettingsState(): SettingsState
{
  return {
    displayControls: settings.get( SettingKey.Controls.Other.DisplayControls ),
    alwaysDisplayPlaybackRate: settings.get( SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed ),
    hideConrolsWhenIdle: settings.get( SettingKey.Controls.Other.HideControlsWhenIdle ),
    hideControlsIdleTime: settings.get( SettingKey.Controls.Other.HideControlsIdleTime ),
  };
}

export const ControlsOverlay: React.FC<Props> = React.memo( ( { controller, video, playing, canSkipBackward, canSkipForward } ) =>
{
  const styles = useStyles();

  const [ controlsSettings, setControlsSettings ] = React.useState( getSettingsState );

  const [ hoveringControls, setHoveringControls ] = React.useState( false );
  const [ hoveringVideo, setHoveringVideo ] = React.useState( false );
  const [ closed, setClosed ] = React.useState( false );
  const [ idle, setIdle ] = React.useState( false );

  const [ playbackRate, setPlaybackRate ] = React.useState( 1.0 );
  const [ looping, setLooping ] = React.useState( false );

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
  }, [ video ] );

  React.useEffect( () =>
  {
    video.addEventListener( 'loadstart', updateVideoState );

    return () =>
    {
      video.removeEventListener( 'loadstart', updateVideoState );
    };
  }, [ video, updateVideoState ] );

  function setVideoPlaybackRate( playbackRate: number )
  {
    video.playbackRate = Math.max( 0, playbackRate );

    updateVideoState();
  }

  function changePlaybackRate( changeValue: number )
  {
    setVideoPlaybackRate( playbackRate + changeValue );

    updateVideoState();
  }

  function setLoop( loop: boolean )
  {
    video.loop = loop;

    updateVideoState();
  }

  const open = (
    controlsSettings.displayControls
    && !closed
    && !( controlsSettings.hideConrolsWhenIdle && idle )
    && ( hoveringControls || hoveringVideo || controlsSettings.alwaysDisplayPlaybackRate )
  );

  return (
    <Popper
      className={styles.root}
      open={open}
      anchorEl={video}
      placement="top-start"
      modifiers={{
        flip: {
          enabled: false,
        },
        inner: {
          enabled: true,
        },
      }}
    >
      <Paper
        className={classNames( styles.paper, {
          [ styles.fadeControls ]: !hoveringControls,
        } )}
        onMouseEnter={() => setHoveringControls( true )}
        onMouseLeave={() => setHoveringControls( false )}
      >
        <Tooltip title="Reset Playback Rate">
          <Button
            className={styles.playbackRate}
            variant="text"
            onClick={() => setVideoPlaybackRate( video.defaultPlaybackRate ?? 1.0 )}
          >
            {playbackRate.toFixed( 1 )}
          </Button>
        </Tooltip>
        <div className={classNames( styles.actions, {
          [ styles.hideActions ]: !hoveringControls,
        } )}
        >
          <ControlButton
            className={styles.controlButton}
            label="Much Slower"
            icon={MuchSlowerIcon}
            enabled={true}
            onClick={() => changePlaybackRate( -0.5 )}
          />
          <ControlButton
            className={styles.controlButton}
            label="Slower"
            icon={MuchSlowerIcon}
            enabled={true}
            onClick={() => changePlaybackRate( -0.1 )}
          />
          <ControlButton
            className={styles.controlButton}
            label="Skip Backward"
            icon={SkipBackwardIcon}
            enabled={canSkipBackward}
            onClick={() => controller.performSkipBackward()}
          />
          {playing ? (
            <ControlButton
              className={styles.controlButton}
              label="Pause"
              icon={PauseIcon}
              enabled={true}
              onClick={() => controller.performPause()}
            />
          ) : (
            <ControlButton
              className={styles.controlButton}
              label="Play"
              icon={PlayIcon}
              enabled={true}
              onClick={() => controller.performPlay()}
            />
          )}
          <ControlButton
            className={styles.controlButton}
            label="Skip Forward"
            icon={SkipForwardIcon}
            enabled={canSkipForward}
            onClick={() => controller.performSkipForward()}
          />
          <ControlButton
            className={styles.controlButton}
            label="Faster"
            icon={FasterIcon}
            enabled={true}
            onClick={() => changePlaybackRate( 0.1 )}
          />
          <ControlButton
            className={styles.controlButton}
            label="Much Faster"
            icon={MuchFasterIcon}
            enabled={true}
            onClick={() => changePlaybackRate( 0.5 )}
          />
          {looping ? (
            <ControlButton
              className={styles.controlButton}
              label="Stop Looping"
              icon={NoLoopIcon}
              enabled={true}
              onClick={() => setLoop( false )}
            />
          ) : (
            <ControlButton
              className={styles.controlButton}
              label="Loop"
              icon={LoopIcon}
              enabled={true}
              onClick={() => setLoop( true )}
            />
          )}
          <ControlButton
            className={styles.controlButton}
            label="Remove Controls"
            icon={RemoveIcon}
            enabled={true}
            onClick={() => setClosed( true )}
          />
        </div>
      </Paper>
    </Popper>
  );
} );

export class Controls
{
  private root: HTMLElement | null = null;

  constructor(
    private readonly parent: Controller
  )
  {
  }

  private getRoot(): HTMLElement
  {
    if( !this.root )
    {
      this.root = document.createElement( 'div' );
    }
    return this.root;
  }

  public remove(): void
  {
    if( this.root )
    {
      ReactDOM.unmountComponentAtNode( this.root );
      this.root.remove();
      this.root = null;
    }
  }

  public update( media: HTMLMediaElement | null, updateMessage: UpdateContentMessage ): void
  {
    if( !( media instanceof HTMLVideoElement ) )
    {
      this.remove();
      return;
    }

    if( !settings.get( SettingKey.Controls.Other.DisplayControls ) )
    {
      this.remove();
      return;
    }

    const root = this.getRoot();

    if( root.parentElement !== document.body )
    {
      console.log( 'Appending controls root:', root );
      document.body.appendChild( root );
    }

    ReactDOM.render(
      (
        <EasyControlThemeProvider forceDarkMode={true}>
          <ControlsOverlay
            controller={this.parent}
            video={media}
            playing={updateMessage.status.playing}
            canSkipBackward={updateMessage.capabilities.skipBackward}
            canSkipForward={updateMessage.capabilities.skipForward}
          />
        </EasyControlThemeProvider>
      ),
      root
    );
  }
}

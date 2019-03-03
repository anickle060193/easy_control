import React from 'react';
import classNames from 'classnames';
import { Theme, createStyles, WithStyles, withStyles, Popper, Typography, Paper, IconButton } from '@material-ui/core';
import MuchSlowerIcon from '@material-ui/icons/FastRewind';
import SkipBackwardIcon from '@material-ui/icons/SkipPrevious';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/Pause';
import SkipForwardIcon from '@material-ui/icons/SkipNext';
import FasterIcon from '@material-ui/icons/PlayArrow';
import MuchFasterIcon from '@material-ui/icons/FastForward';
import LoopIcon from '@material-ui/icons/Repeat';
import NoLoopIcon from '@material-ui/icons/Publish';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import RemoveIcon from '@material-ui/icons/Clear';
import screenfull from 'screenfull';

import { getKeyboardShortcut, limit } from 'common/utilities';
import { SettingKey, settings } from 'common/settings';
import { getSessionStorageItem, setSessionStorageItem, SessionStorageKey } from 'common/sessionStorage';

const FONT_SIZE = 16;

const styles = ( theme: Theme ) => createStyles( {
  mediaHovering: {},
  popper: {
    zIndex: 1000000,
    display: 'none',
    '$mediaHovering&:not( $idle ), &:hover:not( $idle )': {
      display: 'block',
    },
  },
  showPlaybackSpeed: {
    '&:not( $idle )': {
      display: 'block',
    },
  },
  idle: {
    display: 'none',
  },
  paper: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    borderRadius: 3,
    background: 'black',
    opacity: 0.2,
    '$popper:hover &': {
      opacity: 1,
    },
  },
  controls: {
    display: 'none',
    flexDirection: 'row',
    '$mediaHovering &, $popper:hover &': {
      display: 'flex',
    },
  },
  playbackSpeed: {
    fontSize: FONT_SIZE,
    marginRight: 2,
  },
  controlButton: {
    color: 'white',
    padding: 0,
    '&:not( :last-child )': {
      marginRight: 2,
    },
  },
  controlButtonRipple: {
    left: -theme.spacing.unit / 2,
    right: -theme.spacing.unit / 2,
    top: -theme.spacing.unit / 2,
    bottom: -theme.spacing.unit / 2,
    width: 'unset',
    height: 'unset',
  },
  controlIcon: {
    fontSize: FONT_SIZE,
  },
  slowerIcon: {
    transform: 'rotateZ( 180deg )',
  },
  noLoopIcon: {
    transform: 'rotateZ( 90deg )',
  },
} );

function formatShortcutString( text: string, shortcut?: string )
{
  if( shortcut )
  {
    return `${text} [${shortcut}]`;
  }
  else
  {
    return text;
  }
}

const MediaControl: React.SFC<{
  title: string;
  shortcut?: string;
  onClick: () => void;
  content: React.ReactNode;
} & WithStyles<typeof styles>> = ( { classes, title, shortcut, onClick, content } ) => (
  <IconButton
    className={classes.controlButton}
    TouchRippleProps={{
      className: classes.controlButtonRipple,
    }}
    title={formatShortcutString( title, shortcut )}
    onClick={onClick}
  >
    {content}
  </IconButton>
);

interface OwnProps
{
  media: HTMLMediaElement;
  mediaContainer: HTMLElement | null;
  allowsFullscreen: boolean;
  onSkipBackward: () => void;
  onPlay: () => void;
  onPause: () => void;
  onSkipForward: () => void;
  setFullscreen: ( fullscreen: boolean ) => void;
}

interface State
{
  displayControls: boolean;
  alwaysDisplayPlaybackSpeed: boolean;
  hideControlsWhenIdle: boolean;
  mediaSource: string;

  shortcutMuchSlower: string;
  shortcutSlower: string;
  shortcutSkipBackward: string;
  shortcutPlayPause: string;
  shortcutSkipForward: string;
  shortcutFaster: string;
  shortcutMuchFaster: string;
  shortcutReset: string;
  shortcutLoop: string;
  shortcutFullscreen: string;

  removed: boolean;
  paused: boolean;
  playbackRate: number;
  looping: boolean;
  fullscreen: boolean;
  hovering: boolean;
  idle: boolean;
}

type Props = OwnProps & WithStyles<typeof styles>;

class MediaControllerOverlay extends React.Component<Props, State>
{
  private readonly observer: MutationObserver;

  private idleTimeout: number | null = null;

  public readonly state: State = {
    ...this.getSettingsState(),
    mediaSource: this.props.media.currentSrc,
    removed: false,
    paused: this.props.media.paused,
    playbackRate: this.props.media.playbackRate,
    looping: this.props.media.loop,
    fullscreen: this.getIsFullscreen(),
    hovering: false,
    idle: false,
  };

  constructor( props: Props )
  {
    super( props );

    this.observer = new MutationObserver( this.onSourceChanged );
  }

  public componentDidMount()
  {
    this.onSourceChanged();

    this.observer.observe( this.props.media, {
      attributes: true,
      attributeFilter: [ 'src' ]
    } );

    document.addEventListener( 'keydown', this.onDocumentKeyDown );
    document.addEventListener( 'mousemove', this.onDocumentMouseMove );

    if( screenfull )
    {
      screenfull.on( 'change', this.onFullscreenChange );
    }

    this.props.media.addEventListener( 'ratechange', this.onPlaybackRateChange );
    this.props.media.addEventListener( 'playing', this.onMediaPlayingPaused );
    this.props.media.addEventListener( 'pause', this.onMediaPlayingPaused );

    if( this.props.media instanceof HTMLVideoElement )
    {
      this.props.media.addEventListener( 'mouseenter', this.onMediaMouseEnter );
      this.props.media.addEventListener( 'mouseleave', this.onMediaMouseLeave );
    }

    settings.addOnChangeListener( this.onSettingsChange );

    this.onDocumentMouseMove();
  }

  public componentWillUnmount()
  {
    this.observer.disconnect();

    document.removeEventListener( 'keydown', this.onDocumentKeyDown );
    document.removeEventListener( 'mousemove', this.onDocumentMouseMove );

    if( screenfull )
    {
      screenfull.off( 'change', this.onFullscreenChange );
    }

    this.props.media.removeEventListener( 'ratechange', this.onPlaybackRateChange );
    this.props.media.removeEventListener( 'playing', this.onMediaPlayingPaused );
    this.props.media.removeEventListener( 'pause', this.onMediaPlayingPaused );

    this.props.media.removeEventListener( 'mouseenter', this.onMediaMouseEnter );
    this.props.media.removeEventListener( 'mouseleave', this.onMediaMouseLeave );

    settings.removeOnChangeListener( this.onSettingsChange );

    if( this.idleTimeout !== null )
    {
      window.clearTimeout( this.idleTimeout );
    }
  }

  public render()
  {
    const { classes, allowsFullscreen } = this.props;
    const {
      displayControls, alwaysDisplayPlaybackSpeed, hideControlsWhenIdle,
      mediaSource, removed, paused, playbackRate, looping, fullscreen, hovering, idle
    } = this.state;

    if( !displayControls
      || removed
      || !mediaSource )
    {
      return null;
    }

    return (
      <Popper
        className={classNames(
          classes.popper,
          alwaysDisplayPlaybackSpeed && classes.showPlaybackSpeed,
          hovering && classes.mediaHovering,
          hideControlsWhenIdle && idle && classes.idle
        )}
        anchorEl={this.props.media}
        open={this.props.media !== null}
        placement="top-start"
        modifiers={{
          flip: {
            enabled: false,
          },
          inner: {
            enabled: true,
          },
        }}
        disablePortal={false}
        container={this.props.mediaContainer}
      >
        <Paper className={classes.paper}>
          <MediaControl
            classes={classes}
            title="Reset Playback Speed"
            content={<Typography className={classes.playbackSpeed} variant="button" color="inherit">{playbackRate.toFixed( 1 )}</Typography>}
            shortcut={this.state.shortcutReset}
            onClick={this.onPlaybackRateReset}
          />
          <div className={classes.controls}>
            <MediaControl
              classes={classes}
              title="Much Slower"
              content={<MuchSlowerIcon className={classes.controlIcon} />}
              shortcut={this.state.shortcutMuchSlower}
              onClick={this.onPlaybackMuchSlower}
            />
            <MediaControl
              classes={classes}
              title="Slower"
              content={<FasterIcon className={classNames( classes.controlIcon, classes.slowerIcon )} />}
              shortcut={this.state.shortcutSlower}
              onClick={this.onPlaybackSlower}
            />
            <MediaControl
              classes={classes}
              title="Skip Backward"
              content={<SkipBackwardIcon className={classes.controlIcon} />}
              shortcut={this.state.shortcutSkipBackward}
              onClick={this.props.onSkipBackward}
            />
            {paused ?
              (
                <MediaControl
                  classes={classes}
                  title="Play"
                  content={<PlayIcon className={classes.controlIcon} />}
                  shortcut={this.state.shortcutPlayPause}
                  onClick={this.props.onPlay}
                />
              ) :
              (
                <MediaControl
                  classes={classes}
                  title="Pause"
                  content={<PauseIcon className={classes.controlIcon} />}
                  shortcut={this.state.shortcutPlayPause}
                  onClick={this.props.onPause}
                />
              )}
            <MediaControl
              classes={classes}
              title="Skip Forward"
              content={<SkipForwardIcon className={classes.controlIcon} />}
              shortcut={this.state.shortcutSkipForward}
              onClick={this.props.onSkipForward}
            />
            <MediaControl
              classes={classes}
              title="Faster"
              content={<FasterIcon className={classes.controlIcon} />}
              shortcut={this.state.shortcutFaster}
              onClick={this.onPlaybackFaster}
            />
            <MediaControl
              classes={classes}
              title="Much Faster"
              content={<MuchFasterIcon className={classes.controlIcon} />}
              shortcut={this.state.shortcutMuchFaster}
              onClick={this.onPlaybackMuchFaster}
            />
            {looping ?
              (
                <MediaControl
                  classes={classes}
                  title="No Loop"
                  content={<NoLoopIcon className={classNames( classes.controlIcon, classes.noLoopIcon )} />}
                  shortcut={this.state.shortcutLoop}
                  onClick={this.onNoLoop}
                />
              ) :
              (
                <MediaControl
                  classes={classes}
                  title="Loop"
                  content={<LoopIcon className={classes.controlIcon} />}
                  shortcut={this.state.shortcutLoop}
                  onClick={this.onLoop}
                />
              )}
            {allowsFullscreen && (
              fullscreen ?
                (
                  <MediaControl
                    classes={classes}
                    title="Exit Fullscreen"
                    content={<FullscreenExitIcon className={classes.controlIcon} />}
                    shortcut={this.state.shortcutFullscreen}
                    onClick={this.onUnFullscreen}
                  />
                )
                : (
                  <MediaControl
                    classes={classes}
                    title="Fullscreen"
                    content={<FullscreenIcon className={classes.controlIcon} />}
                    shortcut={this.state.shortcutFullscreen}
                    onClick={this.onFullscreen}
                  />
                )
            )}
            <MediaControl
              classes={classes}
              title="Remove"
              content={<RemoveIcon className={classes.controlIcon} />}
              onClick={this.onRemove}
            />
          </div>
        </Paper>
      </Popper>
    );
  }

  private getSettingsState()
  {
    return {
      alwaysDisplayPlaybackSpeed: settings.get( SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed ),
      displayControls: settings.get( SettingKey.Controls.Other.DisplayControls ),
      hideControlsWhenIdle: settings.get( SettingKey.Controls.Other.HideControlsWhenIdle ),
      shortcutMuchSlower: settings.get( SettingKey.Controls.MediaControls.MuchSlower ),
      shortcutSlower: settings.get( SettingKey.Controls.MediaControls.Slower ),
      shortcutSkipBackward: settings.get( SettingKey.Controls.MediaControls.SkipBackward ),
      shortcutPlayPause: settings.get( SettingKey.Controls.MediaControls.PlayPause ),
      shortcutSkipForward: settings.get( SettingKey.Controls.MediaControls.SkipForward ),
      shortcutFaster: settings.get( SettingKey.Controls.MediaControls.Faster ),
      shortcutMuchFaster: settings.get( SettingKey.Controls.MediaControls.MuchFaster ),
      shortcutReset: settings.get( SettingKey.Controls.MediaControls.Reset ),
      shortcutLoop: settings.get( SettingKey.Controls.MediaControls.Loop ),
      shortcutFullscreen: settings.get( SettingKey.Controls.MediaControls.Fullscreen ),
    };
  }

  private getIsFullscreen()
  {
    return (
      screenfull &&
      screenfull.element &&
      ( screenfull.element === this.props.media ||
        screenfull.element.contains( this.props.media ) )
    );
  }

  private onPlaybackRateReset = () =>
  {
    this.setPlaybackRate( 1.0 );
  }

  private onPlaybackMuchSlower = () =>
  {
    this.setPlaybackRate( this.props.media.playbackRate - 0.5 );
  }

  private onPlaybackSlower = () =>
  {
    this.setPlaybackRate( this.props.media.playbackRate - 0.1 );
  }

  private onPlaybackFaster = () =>
  {
    this.setPlaybackRate( this.props.media.playbackRate + 0.1 );
  }

  private onPlaybackMuchFaster = () =>
  {
    this.setPlaybackRate( this.props.media.playbackRate + 0.5 );
  }

  private onLoop = () =>
  {
    this.setLoop( true );
  }

  private onNoLoop = () =>
  {
    this.setLoop( false );
  }

  private setLoop( loop: boolean )
  {
    this.props.media.loop = loop;
    this.setState( { looping: loop } );
  }

  private onFullscreen = () =>
  {
    this.props.setFullscreen( true );
  }

  private onUnFullscreen = () =>
  {
    this.props.setFullscreen( false );
  }

  private setPlaybackRate( playbackRate: number )
  {
    playbackRate = limit( playbackRate, 0, 16 );
    if( this.props.media.playbackRate !== playbackRate )
    {
      this.props.media.playbackRate = playbackRate;

      setSessionStorageItem( SessionStorageKey.PlaybackRate, this.props.media.playbackRate );
    }
  }

  private onRemove = () =>
  {
    this.setState( { removed: true } );
  }

  private onSettingsChange = () =>
  {
    this.setState( this.getSettingsState() );
  }

  private onSourceChanged = () =>
  {
    this.props.media.playbackRate = getSessionStorageItem( SessionStorageKey.PlaybackRate );
    this.setState( { mediaSource: this.props.media.currentSrc } );
  }

  private onPlaybackRateChange = () =>
  {
    this.setState( { playbackRate: this.props.media.playbackRate } );
  }

  private onMediaPlayingPaused = () =>
  {
    this.setState( { paused: this.props.media.paused } );
  }

  private onMediaMouseEnter = () =>
  {
    this.setState( { hovering: true } );
  }

  private onMediaMouseLeave = () =>
  {
    this.setState( { hovering: false } );
  }

  private onDocumentKeyDown = ( e: KeyboardEvent ) =>
  {
    let shortcut = getKeyboardShortcut( e );

    if( !shortcut )
    {
      return true;
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.MuchSlower ) )
    {
      this.onPlaybackMuchSlower();
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.Slower ) )
    {
      this.onPlaybackSlower();
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.SkipBackward ) )
    {
      this.props.onSkipBackward();
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.PlayPause ) )
    {
      if( this.state.paused )
      {
        this.props.onPlay();
      }
      else
      {
        this.props.onPause();
      }
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.SkipForward ) )
    {
      this.props.onSkipForward();
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.Faster ) )
    {
      this.onPlaybackFaster();
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.MuchFaster ) )
    {
      this.onPlaybackMuchFaster();
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.Reset ) )
    {
      this.onPlaybackRateReset();
      this.setState( { removed: false } );
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.Loop ) )
    {
      if( this.props.media.loop )
      {
        this.onNoLoop();
      }
      else
      {
        this.onLoop();
      }
    }
    else if( shortcut === settings.get( SettingKey.Controls.MediaControls.Fullscreen ) )
    {
      if( this.state.fullscreen )
      {
        this.onUnFullscreen();
      }
      else
      {
        this.onFullscreen();
      }
    }
    else
    {
      return true;
    }

    return false;
  }

  private onDocumentMouseMove = () =>
  {
    if( !this.state.hideControlsWhenIdle )
    {
      return;
    }

    if( this.idleTimeout !== null )
    {
      window.clearTimeout( this.idleTimeout );
    }

    this.setState( { idle: false } );
    this.idleTimeout = window.setTimeout( this.onIdleTimeout, settings.get( SettingKey.Controls.Other.HideControlsIdleTime ) * 1000 );
  }

  private onIdleTimeout = () =>
  {
    this.setState( { idle: true } );
  }

  private onFullscreenChange = () =>
  {
    this.setState( {
      fullscreen: this.getIsFullscreen()
    } );
  }
}

export default withStyles( styles )( MediaControllerOverlay );

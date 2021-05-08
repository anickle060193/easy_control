import React from 'react';
import { createStyles, IconButton, makeStyles, SvgIconProps, Tooltip, Typography } from '@material-ui/core';
import ArtworkIcon from '@material-ui/icons/MusicNote';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import PreviousIcon from '@material-ui/icons/SkipPrevious';
import NextIcon from '@material-ui/icons/SkipNext';
import SkipBackwardIcon from '@material-ui/icons/Replay10';
import SkipForwardIcon from '@material-ui/icons/Forward10';
import LikeIcon from '@material-ui/icons/ThumbUpOutlined';
import UnlikeIcon from '@material-ui/icons/ThumbUp';
import DislikeIcon from '@material-ui/icons/ThumbDownOutlined';
import UndislikeIcon from '@material-ui/icons/ThumbDown';

import { ControllerCommand, DEFAULT_CONTROLLER_CAPABILITIES, DEFAULT_CONTROLLER_MEDIA, DEFAULT_CONTROLLER_STATUS } from '../common/controllers';
import { BackgroundMessage, BackgroundMessageId } from '../common/backgroundMessages';
import settings, { SettingKey } from '../common/settings';
import { CommandControlsPopupMessage, ControlsPopupMessageId } from '../common/controlsPopupMessages';

interface ControlButtonProps
{
  label: string;
  icon: React.ComponentType<SvgIconProps>;
  command: ControllerCommand;
  enabled: boolean;
  onClick: ( command: ControllerCommand ) => void;
}

const ControlButton: React.FC<ControlButtonProps> = ( { label, icon: IconComponent, command, enabled, onClick } ) =>
{
  return (
    <Tooltip title={label}>
      <div>
        <IconButton
          onClick={() => onClick( command )}
          disabled={!enabled}
        >
          <IconComponent />
        </IconButton>
      </div>
    </Tooltip>
  );
};

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing( 1 ),
  },
  artworkContainer: {
    flex: 1,
    flexShrink: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  artwork: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
  },
  artworkIcon: {
    width: '100%',
    height: '100%',
    color: theme.palette.text.hint,
  },
  mediaText: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing( 1 ),
  },
} ) );

export const ControlsPopup: React.FC = () =>
{
  const styles = useStyles();

  const [ status, setStatus ] = React.useState( DEFAULT_CONTROLLER_STATUS );
  const [ media, setMedia ] = React.useState( DEFAULT_CONTROLLER_MEDIA );
  const [ capabilities, setCapabilities ] = React.useState( DEFAULT_CONTROLLER_CAPABILITIES );

  React.useEffect( () =>
  {
    function onMessage( event: MessageEvent )
    {
      if( event.origin !== chrome.runtime.getURL( '' ).replace( /\/$/, '' ) )
      {
        console.warn( 'Unknown origin:', event.origin, event );
        return;
      }

      const message = event.data as BackgroundMessage;
      if( message.id === BackgroundMessageId.Update )
      {
        setStatus( message.status );
        setMedia( message.media );
        setCapabilities( message.capabilities );
      }
      else
      {
        console.warn( 'Unhandled message from background:', message, event );
      }
    }

    window.addEventListener( 'message', onMessage );

    return () =>
    {
      window.removeEventListener( 'message', onMessage );
    };
  }, [] );

  const resizeTimeoutRef = React.useRef<number>();

  React.useEffect( () =>
  {
    function onResize()
    {
      window.clearTimeout( resizeTimeoutRef.current );

      resizeTimeoutRef.current = window.setTimeout( () =>
      {
        settings.set( SettingKey.Other.ControlsPopupWidth, window.outerWidth );
        settings.set( SettingKey.Other.ControlsPopupHeight, window.outerHeight );
      }, 500 );
    }

    window.addEventListener( 'resize', onResize, { passive: true } );

    return () =>
    {
      window.clearTimeout( resizeTimeoutRef.current );

      window.removeEventListener( 'resize', onResize );
    };
  }, [] );

  function onCommandClick( command: ControllerCommand )
  {
    const message: CommandControlsPopupMessage = {
      id: ControlsPopupMessageId.Command,
      command,
    };
    chrome.runtime.sendMessage( message );
  }

  return (
    <div className={styles.root}>
      <div className={styles.artworkContainer}>
        {media.artwork ? (
          <img
            className={styles.artwork}
            src={media.artwork}
            alt={media.track ?? undefined}
          />
        ) : (
          <ArtworkIcon className={styles.artworkIcon} />
        )}
      </div>
      <Typography className={styles.mediaText} variant="h6" component="span" title={media.track ?? undefined}>{media.track}</Typography>
      <Typography className={styles.mediaText} variant="body1" title={media.artist ?? undefined}>{media.artist}</Typography>
      <Typography className={styles.mediaText} variant="body2" title={media.album ?? undefined}>{media.album}</Typography>
      <div className={styles.buttonRow}>
        {( capabilities.skipBackward || capabilities.skipForward ) && (
          <ControlButton
            label="Skip Backward"
            icon={SkipBackwardIcon}
            command={ControllerCommand.SkipBackward}
            enabled={capabilities.skipBackward}
            onClick={onCommandClick}
          />
        )}
        <ControlButton
          label="Previous"
          icon={PreviousIcon}
          command={ControllerCommand.Previous}
          enabled={capabilities.previous}
          onClick={onCommandClick}
        />
        {status.playing ? (
          <ControlButton
            label="Pause"
            icon={PauseIcon}
            command={ControllerCommand.Pause}
            enabled={status.enabled}
            onClick={onCommandClick}
          />
        ) : (
          <ControlButton
            label="Play"
            icon={PlayIcon}
            command={ControllerCommand.Play}
            enabled={status.enabled}
            onClick={onCommandClick}
          />
        )}
        <ControlButton
          label="Next"
          icon={NextIcon}
          command={ControllerCommand.Next}
          enabled={capabilities.next}
          onClick={onCommandClick}
        />
        {( capabilities.skipBackward || capabilities.skipForward ) && (
          <ControlButton
            label="Skip Forward"
            icon={SkipForwardIcon}
            command={ControllerCommand.SkipForward}
            enabled={capabilities.skipForward}
            onClick={onCommandClick}
          />
        )}
      </div>
      <div className={styles.buttonRow}>
        {media.disliked ? (
          <ControlButton
            label="Undislike"
            icon={UndislikeIcon}
            command={ControllerCommand.Undislike}
            enabled={capabilities.undislike}
            onClick={onCommandClick}
          />
        ) : (
          <ControlButton
            label="Dislike"
            icon={DislikeIcon}
            command={ControllerCommand.Dislike}
            enabled={capabilities.dislike}
            onClick={onCommandClick}
          />
        )}
        {media.liked ? (
          <ControlButton
            label="Unlike"
            icon={UnlikeIcon}
            command={ControllerCommand.Unlike}
            enabled={capabilities.unlike}
            onClick={onCommandClick}
          />
        ) : (
          <ControlButton
            label="Like"
            icon={LikeIcon}
            command={ControllerCommand.Like}
            enabled={capabilities.like}
            onClick={onCommandClick}
          />
        )}
      </div>
    </div>
  );
};

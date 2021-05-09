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
import { ControlsPopupMessage, ControlsPopupMessageId } from '../common/controlsPopupMessages';

function sendMessageToBackground( message: ControlsPopupMessage )
{
  chrome.runtime.sendMessage( message );
}

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
    overflow: 'hidden',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  artworkContainer: {
    width: 200,
    flexShrink: 0,
    position: 'relative',
  },
  artwork: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing( 1 ),
  },
  mediaText: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
  contentRow: {
    display: 'flex',
    flexDirection: 'row',
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

    sendMessageToBackground( {
      id: ControlsPopupMessageId.Loaded,
    } );

    return () =>
    {
      window.removeEventListener( 'message', onMessage );
    };
  }, [] );

  React.useEffect( () =>
  {
    document.title = [ media.track, media.artist, media.album ].filter( ( s ): s is string => typeof s === 'string' ).join( ' - ' );
  }, [ media.track, media.artist, media.album ] );

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
    sendMessageToBackground( {
      id: ControlsPopupMessageId.Command,
      command,
    } );
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.artworkContainer}>
          {media.artwork ? (
            <img
              className={styles.artwork}
              src={media.artwork}
              alt={media.track ?? undefined}
            />
          ) : (
            <ArtworkIcon className={styles.artwork} />
          )}
        </div>
        <div className={styles.content}>
          <Typography className={styles.mediaText} component="span" variant="h6" title={media.track ?? undefined}>{media.track}</Typography>
          <Typography className={styles.mediaText} component="span" variant="body1" title={media.artist ?? undefined}>{media.artist}</Typography>
          <Typography className={styles.mediaText} component="span" variant="body2" title={media.album ?? undefined}>{media.album}</Typography>
          <div className={styles.contentRow}>
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
              label="Previous"
              icon={PreviousIcon}
              command={ControllerCommand.Previous}
              enabled={capabilities.previous}
              onClick={onCommandClick}
            />
            <ControlButton
              label="Next"
              icon={NextIcon}
              command={ControllerCommand.Next}
              enabled={capabilities.next}
              onClick={onCommandClick}
            />
            {( capabilities.skipBackward || capabilities.skipForward ) && (
              <>
                <ControlButton
                  label="Skip Backward"
                  icon={SkipBackwardIcon}
                  command={ControllerCommand.SkipBackward}
                  enabled={capabilities.skipBackward}
                  onClick={onCommandClick}
                />
                <ControlButton
                  label="Skip Forward"
                  icon={SkipForwardIcon}
                  command={ControllerCommand.SkipForward}
                  enabled={capabilities.skipForward}
                  onClick={onCommandClick}
                />
              </>
            )}
          </div>
          <div className={styles.contentRow}>
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
      </div>
    </div>
  );
};

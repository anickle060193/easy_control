import React from 'react';
import { Box, IconButton, styled, SvgIconProps, SxProps, Tooltip, Typography } from '@mui/material';
import { MusicNote, Pause, PlayArrow, Replay, SkipNext, SkipPrevious, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';

import { ControllerCommand, DEFAULT_CONTROLLER_CAPABILITIES, DEFAULT_CONTROLLER_MEDIA, DEFAULT_CONTROLLER_STATUS } from '../common/controllers';
import { BackgroundMessage, BackgroundMessageId } from '../common/backgroundMessages';
import settings, { SettingKey } from '../common/settings';
import { ControlsPopupMessage, ControlsPopupMessageId } from '../common/controlsPopupMessages';

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
    <Tooltip title={label} disableInteractive={true}>
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

const SkipForwardIcon = styled( Replay )( {
  transform: 'scaleY( -1 )',
} );

const MediaText = styled( Typography )( ( { theme } ) => ( {
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: theme.palette.text.secondary,
  flexShrink: 0,
} ) );

const ContentRow = styled( 'div' )( {
  display: 'flex',
  flexDirection: 'row',
} );

const ARTWORK_SX: SxProps = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

export const ControlsPopup: React.FC = () =>
{
  const [ status, setStatus ] = React.useState( DEFAULT_CONTROLLER_STATUS );
  const [ media, setMedia ] = React.useState( DEFAULT_CONTROLLER_MEDIA );
  const [ capabilities, setCapabilities ] = React.useState( DEFAULT_CONTROLLER_CAPABILITIES );

  const portRef = React.useRef<browser.Runtime.Port>();

  React.useEffect( () =>
  {
    const port = browser.runtime.connect( {
      name: 'controls-popup',
    } );

    portRef.current = port;

    port.onMessage.addListener( ( message: BackgroundMessage ) =>
    {
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
    } );

    port.onDisconnect.addListener( () =>
    {
      console.warn( 'Port disconnected' );
      window.close();
    } );

    const message: ControlsPopupMessage = {
      id: ControlsPopupMessageId.Loaded,
    };

    port.postMessage( message );

    return () =>
    {
      console.log( 'Disconnecting port' );
      port.disconnect();
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

      resizeTimeoutRef.current = window.setTimeout( async () =>
      {
        await settings.set( SettingKey.Other.ControlsPopupWidth, window.outerWidth );
        await settings.set( SettingKey.Other.ControlsPopupHeight, window.outerHeight );
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
    if( !portRef.current )
    {
      console.warn( 'Port is not connected' );
      return;
    }

    const message: ControlsPopupMessage = {
      id: ControlsPopupMessageId.Command,
      command,
    };
    portRef.current.postMessage( message );
  }

  return (
    <Box
      sx={{
        overflow: 'hidden',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{
            width: 200,
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {media.artwork ? (
            <Box
              component="img"
              sx={ARTWORK_SX}
              src={media.artwork}
              alt={media.track ?? undefined}
            />
          ) : (
            <MusicNote sx={ARTWORK_SX} />
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 1,
          }}
        >
          <MediaText variant="h6" title={media.track ?? undefined}>{media.track}</MediaText>
          <MediaText variant="body1" title={media.artist ?? undefined}>{media.artist}</MediaText>
          <MediaText variant="body2" title={media.album ?? undefined}>{media.album}</MediaText>
          <ContentRow>
            {status.playing ? (
              <ControlButton
                label="Pause"
                icon={Pause}
                command={ControllerCommand.Pause}
                enabled={status.enabled}
                onClick={onCommandClick}
              />
            ) : (
              <ControlButton
                label="Play"
                icon={PlayArrow}
                command={ControllerCommand.Play}
                enabled={status.enabled}
                onClick={onCommandClick}
              />
            )}
            <ControlButton
              label="Previous"
              icon={SkipPrevious}
              command={ControllerCommand.Previous}
              enabled={capabilities.previous}
              onClick={onCommandClick}
            />
            <ControlButton
              label="Next"
              icon={SkipNext}
              command={ControllerCommand.Next}
              enabled={capabilities.next}
              onClick={onCommandClick}
            />
            {( capabilities.skipBackward || capabilities.skipForward ) && (
              <>
                <ControlButton
                  label="Skip Backward"
                  icon={Replay}
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
          </ContentRow>
          <ContentRow>
            {media.disliked ? (
              <ControlButton
                label="Undislike"
                icon={ThumbDown}
                command={ControllerCommand.Undislike}
                enabled={capabilities.undislike}
                onClick={onCommandClick}
              />
            ) : (
              <ControlButton
                label="Dislike"
                icon={ThumbDownOutlined}
                command={ControllerCommand.Dislike}
                enabled={capabilities.dislike}
                onClick={onCommandClick}
              />
            )}
            {media.liked ? (
              <ControlButton
                label="Unlike"
                icon={ThumbUp}
                command={ControllerCommand.Unlike}
                enabled={capabilities.unlike}
                onClick={onCommandClick}
              />
            ) : (
              <ControlButton
                label="Like"
                icon={ThumbUpOutlined}
                command={ControllerCommand.Like}
                enabled={capabilities.like}
                onClick={onCommandClick}
              />
            )}
          </ContentRow>
        </Box>
      </Box>
    </Box>
  );
};

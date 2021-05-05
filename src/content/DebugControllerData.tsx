import React from 'react';
import ReactDOM from 'react-dom';
import { createStyles, makeStyles, Paper } from '@material-ui/core';
import LikedIcon from '@material-ui/icons/ThumbUp';
import NotLikedIcon from '@material-ui/icons/ThumbUpOutlined';
import DislikedIcon from '@material-ui/icons/ThumbDown';
import NotDislikedIcon from '@material-ui/icons/ThumbDownOutlined';
import TrueIcon from '@material-ui/icons/CheckBox';
import FalseIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { EasyControlThemeProvider } from '../common/components/EasyControlThemeProvider';
import { UpdateContentMessage } from '../common/contentMessages';
import { ControllerCapabilities, ControllerId, ControllerMedia, CONTROLLERS, ControllerStatus } from '../common/controllers';

function s( value: unknown ): string
{
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `${value}`;
}

const BooleanIcon: React.FC<{ b: boolean }> = ( { b } ) =>
{
  if( b )
  {
    return <TrueIcon color="primary" />;
  }
  else
  {
    return <FalseIcon color="action" />;
  }
};

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: 1000000,
    margin: theme.spacing( 1 ),
    padding: theme.spacing( 1 ),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
} ) );

interface Props
{
  controllerId: ControllerId;
  status: ControllerStatus;
  media: ControllerMedia;
  capabilities: ControllerCapabilities;
}

const DebugControllerData: React.FC<Props> = ( { controllerId, media, status, capabilities } ) =>
{
  const styles = useStyles();

  return (
    <Paper className={styles.root}>
      <div className={styles.row}>{CONTROLLERS[ controllerId ].name}</div>
      <div className={styles.row}>Media:</div>
      <div className={styles.row}>Track: {s( media.track )}</div>
      <div className={styles.row}>Artist: {s( media.artist )}</div>
      <div className={styles.row}>Album: {s( media.album )}</div>
      <div className={styles.row}>Artwork: {s( media.artwork )}</div>
      <div className={styles.row}>
        {media.liked ? (
          <LikedIcon color="primary" />
        ) : (
          <NotLikedIcon color="action" />
        )}
        {media.disliked ? (
          <DislikedIcon color="primary" />
        ) : (
          <NotDislikedIcon color="action" />
        )}
      </div>
      <div className={styles.row}>Status:</div>
      <div className={styles.row}>Enabled: <BooleanIcon b={status.enabled} /></div>
      <div className={styles.row}>Playing: <BooleanIcon b={status.playing} /></div>
      <div className={styles.row}>Progress: {( status.progress * 100 ).toFixed( 2 )}%</div>
      <div className={styles.row}>Volume: {( status.volume * 100 ).toFixed( 2 )}%</div>
      <div className={styles.row}>Capabilities:</div>
      <div className={styles.row}>Next: <BooleanIcon b={capabilities.next} /></div>
      <div className={styles.row}>Previous: <BooleanIcon b={capabilities.previous} /></div>
      <div className={styles.row}>SkipBackward: <BooleanIcon b={capabilities.skipBackward} /></div>
      <div className={styles.row}>SkipForward: <BooleanIcon b={capabilities.skipForward} /></div>
      <div className={styles.row}>Like: <BooleanIcon b={capabilities.like} /></div>
      <div className={styles.row}>Unlike: <BooleanIcon b={capabilities.unlike} /></div>
      <div className={styles.row}>Dislike: <BooleanIcon b={capabilities.dislike} /></div>
      <div className={styles.row}>Undislike: <BooleanIcon b={capabilities.undislike} /></div>
      <div className={styles.row}>Volume: <BooleanIcon b={capabilities.volume} /></div>
    </Paper>
  );
};

let root: HTMLElement | null = null;

export function updateDebugIndication( controllerId: ControllerId, updateMessage: UpdateContentMessage ): void
{
  if( process.env.NODE_ENV !== 'development' )
  {
    return;
  }

  if( ( window as { EASY_CONTROL_DEBUG?: boolean } ).EASY_CONTROL_DEBUG !== true )
  {
    removeDebugIndication();
    return;
  }

  if( !root )
  {
    root = document.createElement( 'div' );
  }

  if( root.parentElement !== document.body )
  {
    document.body.append( root );
  }

  ReactDOM.render(
    (
      <EasyControlThemeProvider>
        <DebugControllerData
          controllerId={controllerId}
          status={updateMessage.status}
          media={updateMessage.media}
          capabilities={updateMessage.capabilities}
        />
      </EasyControlThemeProvider>
    ),
    root
  );
}

export function removeDebugIndication(): void
{
  if( root )
  {
    ReactDOM.unmountComponentAtNode( root );
    root.remove();
    root = null;
  }
}

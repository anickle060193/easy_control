import React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Typography, Fab } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import PreviousIcon from '@material-ui/icons/SkipPrevious';
import NextIcon from '@material-ui/icons/SkipNext';
import LikeIcon from '@material-ui/icons/ThumbUpOutlined';
import UnlikeIcon from '@material-ui/icons/ThumbUp';
import DislikeIcon from '@material-ui/icons/ThumbDownOutlined';
import UndislikeIcon from '@material-ui/icons/ThumbDown';

import { Message, MessageTypes, SupportedOperations, StatusData, createBasicMessage } from 'common/message';
import { ContentInfo } from 'common/content';

const styles = ( theme: Theme ) => createStyles( {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    padding: theme.spacing.unit * 2,
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentImageContainer: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentImage: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  controlsContainer: {
    marginTop: theme.spacing.unit,
  },
  contentText: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary,
  },
  controlButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
} );

const ControlButton: React.SFC<{
  label: string;
  icon: React.ComponentType<SvgIconProps>;
  enabled: boolean | undefined;
  messageType: MessageTypes.FromControlsPopup;
  onClick: ( messageType: MessageTypes.FromControlsPopup ) => void;
} & WithStyles<typeof styles>> = ( { classes, label, icon: IconComponent, enabled, messageType, onClick } ) => (
  <Fab
    className={classes.controlButton}
    title={label}
    size="medium"
    color="primary"
    disabled={enabled !== true}
    onClick={() => onClick( messageType )}
  >
    <IconComponent fontSize="default" color="inherit" />
  </Fab>
);

interface State
{
  color: string;
  supportedOperations: SupportedOperations;
  status: StatusData;
  content: ContentInfo | null;
}

type Props = WithStyles<typeof styles>;

class ControlsPage extends React.Component<Props, State>
{
  private readonly initialState: State = {
    color: 'black',
    supportedOperations: {},
    status: {
      active: false,
      paused: true,
      progress: 0.0,
      isLiked: false,
      isDisliked: false,
    },
    content: null,
  };

  public readonly state: State = this.initialState;

  public componentDidMount()
  {
    chrome.runtime.onMessage.addListener( this.onMessage );
  }

  public componentWillUnmount()
  {
    chrome.runtime.onMessage.removeListener( this.onMessage );
  }

  public render()
  {
    const { classes } = this.props;
    const { supportedOperations, status, content } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.contentImageContainer}>
          {content && content.image && (
            <img className={classes.contentImage} src={content.image} />
          )}
        </div>
        <div className={classes.controlsContainer}>
          {content && content.title && (
            <div className={classes.row}>
              <Typography className={classes.contentText} variant="h6">{content.title}</Typography>
            </div>
          )}
          {content && content.caption && (
            <div className={classes.row}>
              <Typography className={classes.contentText} variant="body1">{content.caption}</Typography>
            </div>
          )}
          {content && content.subcaption && (
            <div className={classes.row}>
              <Typography className={classes.contentText} variant="body2">{content.subcaption}</Typography>
            </div>
          )}
          <div className={classes.row}>
            <ControlButton
              classes={classes}
              icon={PreviousIcon}
              label="Previous"
              enabled={supportedOperations.previous}
              messageType={MessageTypes.FromControlsPopup.Previous}
              onClick={this.onControlClick}
            />
            {status.paused ?
              (
                <ControlButton
                  classes={classes}
                  icon={PlayIcon}
                  label="Play"
                  enabled={supportedOperations.playPause}
                  messageType={MessageTypes.FromControlsPopup.Play}
                  onClick={this.onControlClick}
                />
              ) :
              (
                <ControlButton
                  classes={classes}
                  icon={PauseIcon}
                  label="Pause"
                  enabled={supportedOperations.playPause}
                  messageType={MessageTypes.FromControlsPopup.Pause}
                  onClick={this.onControlClick}
                />
              )}
            <ControlButton
              classes={classes}
              icon={NextIcon}
              label="Next"
              enabled={supportedOperations.next}
              messageType={MessageTypes.FromControlsPopup.Next}
              onClick={this.onControlClick}
            />
          </div>
          <div className={classes.row}>
            {status.isDisliked ?
              (
                <ControlButton
                  classes={classes}
                  icon={UndislikeIcon}
                  label="Undislike"
                  enabled={supportedOperations.dislike}
                  messageType={MessageTypes.FromControlsPopup.Undislike}
                  onClick={this.onControlClick}
                />
              ) :
              (
                <ControlButton
                  classes={classes}
                  icon={DislikeIcon}
                  label="Dislike"
                  enabled={supportedOperations.dislike}
                  messageType={MessageTypes.FromControlsPopup.Dislike}
                  onClick={this.onControlClick}
                />
              )}
            {status.isLiked ?
              (
                <ControlButton
                  classes={classes}
                  icon={UnlikeIcon}
                  label="Unlike"
                  enabled={supportedOperations.like}
                  messageType={MessageTypes.FromControlsPopup.Unlike}
                  onClick={this.onControlClick}
                />
              ) :
              (
                <ControlButton
                  classes={classes}
                  icon={LikeIcon}
                  label="Like"
                  enabled={supportedOperations.like}
                  messageType={MessageTypes.FromControlsPopup.Like}
                  onClick={this.onControlClick}
                />
              )}
          </div>
        </div>
      </div>
    );
  }

  private onControlClick = ( messageType: MessageTypes.FromControlsPopup ) =>
  {
    chrome.runtime.sendMessage( createBasicMessage( messageType ) );
  }

  private onMessage = ( message: Message ) =>
  {
    if( message.type === MessageTypes.ToControlsPopup.Update )
    {
      if( message.data === null )
      {
        this.setState( this.initialState );
      }
      else
      {
        this.setState( message.data );
      }
    }
    else
    {
      console.warn( 'Unknown message type:', message.type, message );
    }
  }
}

export default withStyles( styles )( ControlsPage );

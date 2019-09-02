import * as controllers from 'background/controllers';

const enum ExternalMessageId
{
  Pause = 'Pause',
  Play = 'Play',
  Next = 'Next',
  Previous = 'Previous',
  SkipBackward = 'SkipBackward',
  SkipForward = 'SkipForward',
  Like = 'Like',
  Unlike = 'Unlike',
  Dislike = 'Dislike',
  Undislike = 'Undislike',
  VolumeUp = 'VolumeUp',
  VolumeDown = 'VolumeDown',
}

interface BaseExternalMessage<T extends ExternalMessageId>
{
  id: T;
}

type ExternalMessage = BaseExternalMessage<ExternalMessageId>;

function isExternalMessage( message: unknown ): message is ExternalMessage
{
  return (
    typeof message === 'object' &&
    typeof ( message as ExternalMessage ).id === 'string' // tslint:disable-line: strict-type-predicates
  );
}

const enum ExternalReturnMessageId
{
  Success = 'Success',
  Failure = 'Failure',
}

interface BaseExternalReturnMessage<T extends ExternalReturnMessageId>
{
  id: T;
}

interface FailedExternalReturnMessage extends BaseExternalReturnMessage<ExternalReturnMessageId.Failure>
{
  error: string;
}

type ExternalReturnMessage = (
  BaseExternalReturnMessage<ExternalReturnMessageId.Success> |
  FailedExternalReturnMessage
);

chrome.runtime.onMessageExternal.addListener( ( message, sender, sendResponse ) =>
{
  console.log( 'External message received:', message, sender );

  let returnMessage: ExternalReturnMessage | null = null;

  if( !isExternalMessage( message ) )
  {
    console.warn( 'Unexpected message format:', message );
    returnMessage = {
      id: ExternalReturnMessageId.Failure,
      error: 'Unexpected message format'
    };
  }
  else if( message.id === ExternalMessageId.Pause )
  {
    controllers.pauseCurrentController();
  }
  else if( message.id === ExternalMessageId.Play )
  {
    controllers.playCurrentController();
  }
  else if( message.id === ExternalMessageId.Next )
  {
    controllers.nextCurrentController();
  }
  else if( message.id === ExternalMessageId.Previous )
  {
    controllers.previousCurrentController();
  }
  else if( message.id === ExternalMessageId.SkipBackward )
  {
    controllers.skipBackwardCurrentController();
  }
  else if( message.id === ExternalMessageId.SkipForward )
  {
    controllers.skipForwardCurrentController();
  }
  else if( message.id === ExternalMessageId.Like )
  {
    controllers.likeCurrentController();
  }
  else if( message.id === ExternalMessageId.Unlike )
  {
    controllers.unlikeCurrentController();
  }
  else if( message.id === ExternalMessageId.Dislike )
  {
    controllers.dislikeCurrentController();
  }
  else if( message.id === ExternalMessageId.Undislike )
  {
    controllers.undislikeCurrentController();
  }
  else if( message.id === ExternalMessageId.VolumeUp )
  {
    controllers.volumeUpCurrentController();
  }
  else if( message.id === ExternalMessageId.VolumeDown )
  {
    controllers.volumeDownCurrentController();
  }
  else
  {
    console.warn( 'Unrecognized external message:', message.id );
    returnMessage = {
      id: ExternalReturnMessageId.Failure,
      error: 'Unrecognized external message: ' + message.id
    };
  }

  if( !returnMessage )
  {
    returnMessage = {
      id: ExternalReturnMessageId.Success
    };
  }

  sendResponse( returnMessage );
} );

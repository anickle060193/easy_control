import { getCurrentController } from './controllers';

import { BackgroundMessageId } from '../common/backgroundMessages';

enum ControllerCommandId
{
  PlayPause = '1_play_pause',
  Next = '2_next',
  Previous = '3_previous',
  SkipBackward = '3a_skip_backward',
  SkipForward = '3b_skip_forward',
  Like = '4_like',
  Unlike = '5_unlike',
  Dislike = '6_dislike',
  Undislike = '7_undislike',
  VolumeUp = '8_volume_up',
  VolumeDown = '9_volume_down',
}

enum OtherCommandId
{
  CopyContentLink = 'a_copy_content_link',
}

const CONTROLLER_COMMANDS_MAPPING: { [ key in ControllerCommandId ]: BackgroundMessageId } = {
  [ ControllerCommandId.PlayPause ]: BackgroundMessageId.PlayPause,
  [ ControllerCommandId.Next ]: BackgroundMessageId.Next,
  [ ControllerCommandId.Previous ]: BackgroundMessageId.Previous,
  [ ControllerCommandId.SkipBackward ]: BackgroundMessageId.SkipBackward,
  [ ControllerCommandId.SkipForward ]: BackgroundMessageId.SkipForward,
  [ ControllerCommandId.Like ]: BackgroundMessageId.Like,
  [ ControllerCommandId.Unlike ]: BackgroundMessageId.Unlike,
  [ ControllerCommandId.Dislike ]: BackgroundMessageId.Dislike,
  [ ControllerCommandId.Undislike ]: BackgroundMessageId.Undislike,
  [ ControllerCommandId.VolumeUp ]: BackgroundMessageId.VolumeUp,
  [ ControllerCommandId.VolumeDown ]: BackgroundMessageId.VolumeDown,
};

export function initCommands(): void
{
  chrome.commands.onCommand.addListener( ( command ) =>
  {
    const controller = getCurrentController();

    const backgroundMessageId = CONTROLLER_COMMANDS_MAPPING[ command as ControllerCommandId ];
    if( typeof backgroundMessageId === 'string' )
    {
      if( !controller )
      {
        console.log( 'No current controller for', backgroundMessageId, 'command' );
      }
      else
      {
        console.log( 'Sending', backgroundMessageId, 'to', controller.name, ':', controller );
        controller.sendMessage( backgroundMessageId );
      }
    }
    else if( command === OtherCommandId.CopyContentLink )
    {
      // Blank
    }
    else
    {
      console.warn( 'Unknown command:', command );
    }
  } );
}

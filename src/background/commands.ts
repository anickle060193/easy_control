import { getCurrentController } from './controllers';

import { ControllerCommand } from '../common/controllers';

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

const CONTROLLER_COMMANDS_MAPPING: { [ key in ControllerCommandId ]: ControllerCommand } = {
  [ ControllerCommandId.PlayPause ]: ControllerCommand.PlayPause,
  [ ControllerCommandId.Next ]: ControllerCommand.Next,
  [ ControllerCommandId.Previous ]: ControllerCommand.Previous,
  [ ControllerCommandId.SkipBackward ]: ControllerCommand.SkipBackward,
  [ ControllerCommandId.SkipForward ]: ControllerCommand.SkipForward,
  [ ControllerCommandId.Like ]: ControllerCommand.Like,
  [ ControllerCommandId.Unlike ]: ControllerCommand.Unlike,
  [ ControllerCommandId.Dislike ]: ControllerCommand.Dislike,
  [ ControllerCommandId.Undislike ]: ControllerCommand.Undislike,
  [ ControllerCommandId.VolumeUp ]: ControllerCommand.VolumeUp,
  [ ControllerCommandId.VolumeDown ]: ControllerCommand.VolumeDown,
};

export function initCommands(): void
{
  browser.commands.onCommand.addListener( ( commandId ) =>
  {
    const controller = getCurrentController();

    const command = CONTROLLER_COMMANDS_MAPPING[ commandId as ControllerCommandId ];
    if( typeof command === 'string' )
    {
      if( !controller )
      {
        console.log( 'No current controller for', command, 'command' );
      }
      else
      {
        console.log( 'Sending', command, 'to', controller.id, ':', controller );
        controller.sendCommand( command );
      }
    }
    else if( commandId === OtherCommandId.CopyContentLink )
    {
      // TODO
    }
    else
    {
      console.warn( 'Unknown command:', commandId );
    }
  } );
}

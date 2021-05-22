import { ControllerCommand } from '../common/controllers';

import { getCurrentController } from './controllers';

interface ExternalMessage
{
  id: 'play_pause' | 'play' | 'pause' | 'next' | 'previous' | 'skip_backward' | 'skip_forward' | 'like' | 'unlike' | 'dislike' | 'undislike' | 'volume_up' | 'volume_down';
}

function isExternalMessage( message: unknown ): message is ExternalMessage
{
  return (
    typeof message === 'object'
    && typeof ( message as ExternalMessage ).id === 'string'
  );
}

const COMMAND_TRANSLATION: { [ key in ExternalMessage[ 'id' ] ]: ControllerCommand } = {
  'play_pause': ControllerCommand.PlayPause,
  'play': ControllerCommand.Play,
  'pause': ControllerCommand.Pause,
  'next': ControllerCommand.Next,
  'previous': ControllerCommand.Previous,
  'skip_backward': ControllerCommand.SkipBackward,
  'skip_forward': ControllerCommand.SkipForward,
  'like': ControllerCommand.Like,
  'unlike': ControllerCommand.Unlike,
  'dislike': ControllerCommand.Dislike,
  'undislike': ControllerCommand.Undislike,
  'volume_up': ControllerCommand.VolumeUp,
  'volume_down': ControllerCommand.VolumeDown,
};

export function initExternal(): void
{
  chrome.runtime.onMessageExternal.addListener( ( message ) =>
  {
    if( !isExternalMessage( message ) )
    {
      console.warn( 'Unknown external message:', message );
      return;
    }

    if( message.id in COMMAND_TRANSLATION )
    {
      const command = COMMAND_TRANSLATION[ message.id ];
      console.log( 'External Command:', command );
      getCurrentController()?.sendCommand( command );
    }
    else
    {
      console.warn( 'Unknown external message id:', message );
    }
  } );
}

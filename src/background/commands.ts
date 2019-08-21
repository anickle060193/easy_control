import * as controllers from 'background/controllers';

chrome.browserAction.onClicked.addListener( () =>
{
  console.log( 'BrowserAction clicked' );
  controllers.playPauseCurrentController();
} );

chrome.commands.onCommand.addListener( ( command ) =>
{
  console.log( 'Command Received:', command );

  if( command === '1_play_pause' )
  {
    controllers.playPauseCurrentController();
  }
  else if( command === '2_next' )
  {
    controllers.nextCurrentController();
  }
  else if( command === '3_previous' )
  {
    controllers.previousCurrentController();
  }
  else if( command === '3a_skip_backward' )
  {
    controllers.skipBackwardCurrentController();
  }
  else if( command === '3b_skip_forward' )
  {
    controllers.skipForwardCurrentController();
  }
  else if( command === '4_like' )
  {
    controllers.likeCurrentController();
  }
  else if( command === '5_unlike' )
  {
    controllers.unlikeCurrentController();
  }
  else if( command === '6_dislike' )
  {
    controllers.dislikeCurrentController();
  }
  else if( command === '7_undislike' )
  {
    controllers.undislikeCurrentController();
  }
  else if( command === '8_volume_up' )
  {
    controllers.volumeUpCurrentController();
  }
  else if( command === '9_volume_down' )
  {
    controllers.volumeDownCurrentController();
  }
  else if( command === 'a_copy_content_link' )
  {
    controllers.copyCurrentControllerContentLink();
  }
  else
  {
    console.warn( 'Unrecognized Command:', command );
  }
} );

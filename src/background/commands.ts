import
{
  playPauseCurrentController,
  nextCurrentController,
  previousCurrentController,
  likeCurrentController,
  unlikeCurrentController,
  dislikeCurrentController,
  undislikeCurrentController,
  volumeUpCurrentController,
  volumeDownCurrentController,
  copyCurrentControllerContentLink
} from 'background/controllers';

chrome.browserAction.onClicked.addListener( () =>
{
  console.log( 'BrowserAction clicked' );
  playPauseCurrentController();
} );

chrome.commands.onCommand.addListener( ( command ) =>
{
  if( command === '1_play_pause' )
  {
    playPauseCurrentController();
  }
  else if( command === '2_next' )
  {
    nextCurrentController();
  }
  else if( command === '3_previous' )
  {
    previousCurrentController();
  }
  else if( command === '4_like' )
  {
    likeCurrentController();
  }
  else if( command === '5_unlike' )
  {
    unlikeCurrentController();
  }
  else if( command === '6_dislike' )
  {
    dislikeCurrentController();
  }
  else if( command === '7_undislike' )
  {
    undislikeCurrentController();
  }
  else if( command === '8_volume_up' )
  {
    volumeUpCurrentController();
  }
  else if( command === '9_volume_down' )
  {
    volumeDownCurrentController();
  }
  else if( command === 'a_copy_content_link' )
  {
    copyCurrentControllerContentLink();
  }
  else
  {
    console.log( 'Unrecognized Command:', command );
  }
} );

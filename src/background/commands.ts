import * as background from './index';

function onStart()
{
  chrome.browserAction.onClicked.addListener( ( tag ) =>
  {
    console.log( 'BrowserAction clicked' );
    background.playPause();
  } );

  chrome.commands.onCommand.addListener( ( command ) =>
  {
    if( command === '1_play_pause' )
    {
      background.playPause();
    }
    else if( command === '2_next' )
    {
      background.next();
    }
    else if( command === '3_previous' )
    {
      background.previous();
    }
    else if( command === '4_like' )
    {
      background.like();
    }
    else if( command === '5_unlike' )
    {
      background.unlike();
    }
    else if( command === '6_dislike' )
    {
      background.dislike();
    }
    else if( command === '7_undislike' )
    {
      background.undislike();
    }
    else if( command === '8_volume_up' )
    {
      background.volumeUp();
    }
    else if( command === '9_volume_down' )
    {
      background.volumeDown();
    }
    else if( command === 'a_copy_content_link' )
    {
      background.copyContentLink();
    }
    else
    {
      console.log( 'Unrecognized Command: ' + command );
    }
  } );
}

onStart();

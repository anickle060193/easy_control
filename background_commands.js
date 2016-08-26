chrome.browserAction.onClicked.addListener( function( tag )
{
    console.log( 'BrowserAction clicked' );
    playPause();
} );


chrome.commands.onCommand.addListener( function( command )
{
    console.log( 'Keyboard Command: ' + command );

    if( command === '1_play_pause' )
    {
        playPause();
    }
    else if( command === '2_next' )
    {
        next();
    }
    else if( command === '3_previous' )
    {
        previous();
    }
    else if( command === '4_like' )
    {
        like();
    }
    else if( command === '5_unlike' )
    {
        unlike();
    }
    else if( command === '6_dislike' )
    {
        dislike();
    }
    else if( command === '7_undislike' )
    {
        undislike();
    }
} );
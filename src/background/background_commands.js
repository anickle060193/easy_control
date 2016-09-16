BackgroundCommands = ( function()
{
    function onStart()
    {
        chrome.browserAction.onClicked.addListener( function( tag )
        {
            console.log( 'BrowserAction clicked' );
            Background.playPause();
        } );


        chrome.commands.onCommand.addListener( function( command )
        {
            console.log( 'Keyboard Command: ' + command );

            if( command === '1_play_pause' )
            {
                Background.playPause();
            }
            else if( command === '2_next' )
            {
                Background.next();
            }
            else if( command === '3_previous' )
            {
                Background.previous();
            }
            else if( command === '4_like' )
            {
                Background.like();
            }
            else if( command === '5_unlike' )
            {
                Background.unlike();
            }
            else if( command === '6_dislike' )
            {
                Background.dislike();
            }
            else if( command === '7_undislike' )
            {
                Background.undislike();
            }
            else if( command === '8_volume_up' )
            {
                Background.volumeUp();
            }
            else if( command === '9_volume_down' )
            {
                Background.volumeDown();
            }
        } );
    }

    return {
        onStart : onStart
    };
} )();

BackgroundCommands.onStart();


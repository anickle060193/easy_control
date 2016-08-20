function SpotifyController( hasProgress, hasControls )
{
    Controller.call( this, 'Spotify', '#84bd00', hasProgress, hasControls );
}

SpotifyController.prototype = Object.create( Controller.prototype );
SpotifyController.prototype.constructor = SpotifyController;

SpotifyController.prototype.getProgress = function()
{
    var currentTrackTime = trackTimeToSeconds( $( '#track-current' ).text() );
    var trackLength = trackTimeToSeconds( $( '#track-length' ).text() );

    var progress = trackLength === 0 ? 0 : currentTrackTime / trackLength;

    return progress
};

SpotifyController.prototype.play = function()
{
    $( '#play-pause' ).click();
};

SpotifyController.prototype.pause = function()
{
    $( '#play-pause' ).click();
};

SpotifyController.prototype.checkIfPaused = function()
{
    return !$( '#play-pause' ).hasClass( 'playing' );
};


$( window ).ready( function()
{
    if( $( '#progress' ).length !== 0 )
    {
        console.log( 'Found progress!' );

        var controller = new SpotifyController( true, false );
        controller.startPolling();
    }

    if( $( '#play-pause' ).length !== 0 )
    {
        console.log( 'Found Play-Pause!' );

        var controller = new SpotifyController( false, true );
        controller.startPolling();
    }

    if( $( '#progress' ).length !== 0 && $( '#play-pause' ).length !== 0 )
    {
        console.log( 'FOUND BOTH!' );
    }
} );
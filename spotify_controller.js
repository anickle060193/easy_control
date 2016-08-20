function SpotifyController()
{
    Controller.call( this, 'Spotify', '#84bd00' );
}

SpotifyController.prototype = Object.create( Controller.prototype );
SpotifyController.prototype.constructor = SpotifyController;

SpotifyController.prototype.play = function()
{
    $( '#play-pause' ).click();
};

SpotifyController.prototype.pause = function()
{
    $( '#play-pause' ).click();
};

SpotifyController.prototype.getProgress = function()
{
    var currentTrackTime = trackTimeToSeconds( $( '#track-current' ).text() );
    var trackLength = trackTimeToSeconds( $( '#track-length' ).text() );

    var progress = trackLength === 0 ? 0 : currentTrackTime / trackLength;

    return progress
};

SpotifyController.prototype.checkIfPaused = function()
{
    return !$( '#play-pause' ).hasClass( 'playing' );
};


$( window ).ready( function()
{
    if( $( '#progress' ).length !== 0 && $( '#play-pause' ).length !== 0 )
    {
        var controller = new SpotifyController();
        controller.startPolling();
    }
} );
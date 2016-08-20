function GooglePlayMusicController()
{
    Controller.call( this, 'GooglePlayMusic', '#ff5722' );
}

GooglePlayMusicController.prototype = Object.create( Controller.prototype );
GooglePlayMusicController.prototype.constructor = GooglePlayMusicController;

GooglePlayMusicController.prototype.play = function()
{
    $( '#player-bar-play-pause' ).click();
};

GooglePlayMusicController.prototype.pause = function()
{
    $( '#player-bar-play-pause' ).click();
};

GooglePlayMusicController.prototype.getProgress = function()
{
    var elapsedTime = trackTimeToSeconds( $( '#time_container_current' ).text() );
    var totalTime = trackTimeToSeconds( $( '#time_container_duration' ).text() );

    var progress = totalTime === 0 ? 0 : elapsedTime / totalTime;

    return progress
};

GooglePlayMusicController.prototype.checkIfPaused = function()
{
    return !$( '#player-bar-play-pause' ).hasClass( 'playing' );
};

GooglePlayMusicController.prototype.getContentInfo = function()
{
    var track = $( '#currently-playing-title' ).text();
    var artist = $( '#player-artist' ).text();
    var album = $( '.player-album' ).text();
    var artwork = $( '#playerBarArt' ).attr( 'src' );
    if( track )
    {
        return new ContentInfo( track, artist, album, artwork );
    }
    else
    {
        return null;
    }
};

$( window ).ready( function()
{
    var controller = new GooglePlayMusicController();
    controller.startPolling();
} );
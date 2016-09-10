function SpotifyController()
{
    Controller.call( this, 'Spotify', '#84bd00' );
}

SpotifyController.prototype = Object.create( Controller.prototype );
SpotifyController.prototype.constructor = SpotifyController;

SpotifyController.prototype._play = function()
{
    $( '#play-pause' ).click();
};

SpotifyController.prototype._pause = function()
{
    $( '#play-pause' ).click();
};

SpotifyController.prototype._previous = function()
{
    $( '#previous' ).click();
};

SpotifyController.prototype._next = function()
{
    $( '#next' ).click();
};

SpotifyController.prototype._getProgress = function()
{
    var currentTrackTime = trackTimeToSeconds( $( '#track-current' ).text() );
    var trackLength = trackTimeToSeconds( $( '#track-length' ).text() );

    if( trackLength === 0 )
    {
        return 0;
    }
    else
    {
        return currentTrackTime / trackLength;
    }
};

SpotifyController.prototype._isPaused = function()
{
    return !$( '#play-pause' ).hasClass( 'playing' );
};

SpotifyController.prototype._getContentInfo = function()
{
    var track = $( '#track-name>a' ).text();
    var artist = $( '#track-artist>a' ).map( function()
        {
            return $( this ).text();
        } ).get().join( ', ' );
    var artwork = "";
    var artworkImg = $( '#cover-art div.sp-image-img' ).css( 'background-image' );
    if( artworkImg )
    {
        artwork = artworkImg.replace( /^.*\s*url\(\s*[\'\"]?/, '' ).replace( /[\'\"]?\s*\).*/, '' );
    }
    if( track )
    {
        return new ContentInfo( track, artist, "", artwork );
    }
    else
    {
        return null;
    }
};


$( function()
{
    if( $( '#progress' ).length !== 0
     && $( '#play-pause' ).length !== 0
     && $( '#previous' ).length !== 0
     && $( '#next' ).length !== 0 )
    {
        var controller = new SpotifyController();
        controller.startPolling();
    }
    else
    {
        console.log( 'Bad Spotify frame.' );
    }
} );
function SpotifyController()
{
    Controller.call( this, 'Spotify' );

    this.color = Controller.settings[ Settings.ControllerColors.Spotify ];

    this.initialize();
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
    var currentTrackTime = Common.parseTime( $( '#track-current' ).text() );
    var trackLength = Common.parseTime( $( '#track-length' ).text() );

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
    var track = $( '#track-name > a' ).eq( 0 ).text();
    var artist = $( '#track-artist > a' ).map( function()
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

SpotifyController.prototype.openContent = function( content )
{
    console.log( 'Spotify - openContent(): ' + content );
    var newUrl = content;
    var dataUri = 'spotify:' + newUrl.replace( 'https://play.spotify.com/', '' ).split( '/' ).join( ':' );

    var a = $( `<a href="${newUrl}" data-uri="${dataUri}"></a>` )
        .text( newUrl )
        .appendTo( document.body );

    a[ 0 ].click();

    a.remove();
};


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Spotify ] )
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
    }
} );
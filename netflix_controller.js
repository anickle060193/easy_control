function NetflixController( video )
{
    MediaController.call( this, video, 'Netflix', '#9b0103' );

    this.allowLockOnInactivity = false;
}

NetflixController.prototype = Object.create( MediaController.prototype );
NetflixController.prototype.constructor = NetflixController;

NetflixController.prototype._play = function()
{
    $( '.player-control-button.player-play-pause' ).click();
};

NetflixController.prototype._pause = function()
{
    $( '.player-control-button.player-play-pause' ).click();
};

NetflixController.prototype._next = function()
{
    $( '.player-control-button.player-next-episode' ).click();
};

NetflixController.prototype._getContentInfo = function()
{
    var playerStatusChildren = $( '.player-status' ).children();

    var episodeTitle = playerStatusChildren.eq( 2 ).text();
    var episodeNumber = playerStatusChildren.eq( 1 ).text();
    var seriesTitle = playerStatusChildren.eq( 0 ).text();

    if( episodeTitle )
    {
        return new ContentInfo( episodeTitle, episodeNumber, seriesTitle, "" );
    }
    else
    {
        return null;
    }
};

$( function()
{
    var videoSource = null;
    var netflixController = null;

    setInterval( function()
    {
        var videos = $( 'video[src]' );

        if( netflixController !== null && ( videos.length === 0 || videos[ 0 ].src !== videoSource ) )
        {
            netflixController.disconnect();
            netflixController = null;
        }

        if( netflixController === null )
        {
            if( videos.length > 0 )
            {
                videoSource = videos[ 0 ].src;
                netflixController = new NetflixController( videos[ 0 ] );
                netflixController.startPolling();
            }
        }
    }, 100 );
} );
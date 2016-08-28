function HuluController( video )
{
    MediaController.call( this, video, 'Hulu', '#66AA33' );

    this.allowLockOnInactivity = false;
}

HuluController.prototype = Object.create( MediaController.prototype );
HuluController.prototype.constructor = HuluController;

HuluController.prototype._play = function()
{
    $( '.controls-bar .play-pause-button' ).click();
};

HuluController.prototype._pause = function()
{
    $( '.controls-bar .play-pause-button' ).click();
};

HuluController.prototype._previous = function()
{
    console.log( 'Hulu does not support previous.' );
};

HuluController.prototype._next = function()
{
    $( '.controls-bar .next-video-button' ).click();
};

HuluController.prototype._like = function()
{
    console.log( 'Hulu does not support like.' );
};

HuluController.prototype._unlike = function()
{
    console.log( 'Hulu does not support unlike.' );
};

HuluController.prototype._dislike = function()
{
    console.log( 'Hulu does not support dislike.' );
};

HuluController.prototype._undislike = function()
{
    console.log( 'Hulu does not support undislike.' );
};

HuluController.prototype._isLiked = function()
{
    return false;
};

HuluController.prototype._isDisliked = function()
{
    return false;
};

HuluController.prototype._getContentInfo = function()
{
    var episodeTitle = $( '.video-description .episode-title' ).text();
    var showTitle = $( '.video-description .show-title' ).text();
    var thumbnail = $( 'meta[property="og:image"]' ).attr( 'content' );

    if( episodeTitle )
    {
        return new ContentInfo( episodeTitle, showTitle, "", thumbnail );
    }
    else
    {
        return null;
    }
};

$( function()
{
    var videoSource = null;
    var huluController = null;

    setInterval( function()
    {
        var videos = $( 'video[src]' );

        if( huluController !== null && ( videos.length === 0 || videos[ 0 ].src !== videoSource ) )
        {
            huluController.disconnect();
            huluController = null;
        }

        if( huluController === null )
        {
            if( videos.length > 0 )
            {
                videoSource = videos[ 0 ].src;
                huluController = new HuluController( videos[ 0 ] );
                huluController.startPolling();
            }
        }
    }, 100 );
} );
function AmazonVideoController( video )
{
    MediaController.call( this, video, 'AmazonVideo', '#FF9900' );

    this.allowLockOnInactivity = false;
}

AmazonVideoController.prototype = Object.create( MediaController.prototype );
AmazonVideoController.prototype.constructor = AmazonVideoController;

AmazonVideoController.prototype._getContentInfo = function()
{
    var title = $( '#aiv-content-title' )[ 0 ].childNodes[ 0 ].nodeValue;
    var thumbnail = $( 'meta[property="og:image"]' ).attr( 'content' );

    if( title )
    {
        return new ContentInfo( title, "", "", thumbnail );
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
                netflixController = new AmazonVideoController( videos[ 0 ] );
                netflixController.startPolling();
            }
        }
    }, 100 );
} );
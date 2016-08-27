function YoutubeController( video )
{
    MediaController.call( this, video, 'Youtube', '#f12b24' );
}

YoutubeController.prototype = Object.create( MediaController.prototype );
YoutubeController.prototype.constructor = YoutubeController;

YoutubeController.prototype._previous = function()
{
    console.log( 'Youtube does not support previous.' );
};

YoutubeController.prototype._next = function()
{
    $( '.ytp-next-button' ).click();
};

YoutubeController.prototype._like = function()
{
    $( 'button.like-button-renderer-like-button.like-button-renderer-like-button-unclicked' ).click();
};

YoutubeController.prototype._unlike = function()
{
    $( 'button.like-button-renderer-like-button.like-button-renderer-like-button-clicked' ).click();
};

YoutubeController.prototype._dislike = function()
{
    $( 'button.like-button-renderer-dislike-button.like-button-renderer-dislike-button-unclicked' ).click();
};

YoutubeController.prototype._undislike = function()
{
    $( 'button.like-button-renderer-dislike-button.like-button-renderer-dislike-button-clicked' ).click();
};

YoutubeController.prototype._isLiked = function()
{
    return !$( 'button.like-button-renderer-like-button.like-button-renderer-like-button-clicked' ).hasClass( 'hid' );
};

YoutubeController.prototype._isDisliked = function()
{
    return !$( 'button.like-button-renderer-dislike-button.like-button-renderer-dislike-button-clicked' ).hasClass( 'hid' );
};

YoutubeController.prototype._getContentInfo = function()
{
    var videoTitle = $( '.watch-title' ).text();
    var channel = $( '.spf-link a' ).text();
    var thumbnail = $( '#watch-header img' ).attr( 'data-thumb' );
    if( videoTitle )
    {
        return new ContentInfo( videoTitle, channel, "", thumbnail );
    }
    else
    {
        return null;
    }
};

$( function()
{
    var videoSource = null;
    var youtubeController = null;

    setInterval( function()
    {
        var videos = $( 'video[src]' );

        if( youtubeController !== null && ( videos.length === 0 || videos[ 0 ].src !== videoSource ) )
        {
            youtubeController.disconnect();
            youtubeController = null;
        }

        if( youtubeController === null )
        {
            if( videos.length > 0 )
            {
                videoSource = videos[ 0 ].src;
                youtubeController = new YoutubeController( videos[ 0 ] );
                youtubeController.startPolling();
            }
        }
    }, 100 );
} );
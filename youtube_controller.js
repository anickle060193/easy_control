function YoutubeController( video )
{
    MediaController.call( this, video, 'Youtube', '#f12b24' );

    this.allowLockOnInactivity = false;
}

YoutubeController.prototype = Object.create( MediaController.prototype );
YoutubeController.prototype.constructor = YoutubeController;

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
    var thumbnailImg = $( '#watch-header img' )[ 0 ];
    var thumbnail = thumbnailImg.src;

    if( videoTitle && thumbnailImg.naturalHeight > 10 )
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
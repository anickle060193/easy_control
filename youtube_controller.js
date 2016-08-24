function YoutubeController()
{
    Controller.call( this, 'Youtube', '#f12b24' );
}

YoutubeController.prototype = Object.create( Controller.prototype );
YoutubeController.prototype.constructor = YoutubeController;

YoutubeController.prototype._play = function()
{
    $( '.ytp-play-button' ).click();
};

YoutubeController.prototype._pause = function()
{
    $( '.ytp-play-button' ).click();
};

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

YoutubeController.prototype._getProgress = function()
{
    var elapsedTime = trackTimeToSeconds( $( '.ytp-time-current' ).text() );
    var totalTime = trackTimeToSeconds( $( '.ytp-time-duration' ).text() );

    var progress = totalTime === 0 ? 0 : elapsedTime / totalTime;

    return progress
};

YoutubeController.prototype._isPaused = function()
{
    return $( '.ytp-play-button' ).attr( 'aria-label' ) !== 'Pause';
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

$( window ).ready( function()
{
    var controller = new YoutubeController();
    controller.startPolling();
} );
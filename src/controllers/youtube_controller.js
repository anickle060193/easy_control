function YoutubeController( video )
{
    MediaController.call( this, 'Youtube', video );

    this.color = Controller.settings[ Settings.ControllerColors.Youtube ];

    this.hasBeenActivated = this.active;

    this.initialize();
}

YoutubeController.prototype = Object.create( MediaController.prototype );
YoutubeController.prototype.constructor = YoutubeController;

YoutubeController.prototype.activate = function()
{
    MediaController.prototype.activate.call( this );

    this.hasBeenActivated = true;
};

YoutubeController.prototype._pause = function()
{
    if( this.hasBeenActivated )
    {
        MediaController.prototype._pause.call( this );
    }
};

YoutubeController.prototype._next = function()
{
    $( '.ytp-next-button' ).click();
};

YoutubeController.prototype._isPaused = function()
{
    return !this.hasBeenActivated || MediaController.prototype._isPaused.call( this );
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

    if( videoTitle && thumbnailImg && thumbnailImg.naturalHeight > 10 )
    {
        return new ContentInfo( videoTitle, channel, "", thumbnailImg.src );
    }
    else
    {
        return null;
    }
};


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Youtube ] )
    {
        MediaController.createSingleMediaListener( 'Youtube', function( media )
        {
            return new YoutubeController( media );
        } );
    }
} );
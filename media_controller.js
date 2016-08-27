function MediaController( media, name, color )
{
    Controller.call( this, name, color );
    this.media = media;
}

MediaController.prototype = Object.create( Controller.prototype );
MediaController.prototype.constructor = MediaController;

MediaController.prototype._play = function()
{
    this.media.play();
};

MediaController.prototype._pause = function()
{
    this.media.pause();
};

MediaController.prototype._previous = function()
{
    console.log( 'Media does not support previous().' );
};

MediaController.prototype._next = function()
{
    console.log( 'Media does not support next().' );
};

MediaController.prototype._like = function()
{
    console.log( 'Media does not support like().' );
};

MediaController.prototype._unlike = function()
{
    console.log( 'Media does not support unlike().' );
};

MediaController.prototype._dislike = function()
{
    console.log( 'Media does not support dislike().' );
};

MediaController.prototype._undislike = function()
{
    console.log( 'Media does not support undislike().' );
};

MediaController.prototype._isLiked = function()
{
    return false;
};

MediaController.prototype._isDisliked = function()
{
    return false;
};

MediaController.prototype._getProgress = function()
{
    if( this.media.duration === 0 )
    {
        return 0;
    }
    else
    {
        return this.media.currentTime / this.media.duration;
    }
};

MediaController.prototype._isPaused = function()
{
    return this.media.paused;
};

MediaController.prototype._getContentInfo = function()
{
    return null;
};

/*
$( window ).ready( function()
{
    var mediaControllers = [ ];
    $( 'video, audio' ).each( function( index )
    {
        var mediaController = new MediaController( this, 'Media_' + index, '#dddddd' );
        mediaController.startPolling();
        mediaControllers.push( mediaController );
    } );
} );
*/
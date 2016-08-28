function AmazonMusicController()
{
    Controller.call( this, 'AmazonMusic', '#fd7c02' );
}

AmazonMusicController.prototype = Object.create( Controller.prototype );
AmazonMusicController.prototype.constructor = AmazonMusicController;

AmazonMusicController.prototype._play = function()
{
    $( '.playbackControlsView .playButton' ).click();
};

AmazonMusicController.prototype._pause = function()
{
    $( '.playbackControlsView .playButton' ).click();
};

AmazonMusicController.prototype._previous = function()
{
    $( '.playbackControlsView .previousButton' ).click();
};

AmazonMusicController.prototype._next = function()
{
    $( '.playbackControlsView .nextButton' ).click();
};

AmazonMusicController.prototype._like = function()
{
    console.log( 'Amazon Music does not support like.' );
};

AmazonMusicController.prototype._unlike = function()
{
    console.log( 'Amazon Music does not support unlike.' );
}

AmazonMusicController.prototype._dislike = function()
{
    console.log( 'Amazon Music does not support dislike.' );
};

AmazonMusicController.prototype._undislike = function()
{
    console.log( 'Amazon Music does not support undislike.' );
}

AmazonMusicController.prototype._isLiked = function()
{
    return false;
};

AmazonMusicController.prototype._isDisliked = function()
{
    return false;
};

AmazonMusicController.prototype._getProgress = function()
{
    var scrubberBackgroundWidth = $( '.playbackControlsView .scrubberBackground' )[ 0 ].style.width;

    var progress = parseFloat( scrubberBackgroundWidth ) / 100.0;

    return progress;
};

AmazonMusicController.prototype._isPaused = function()
{
    return $( '.playbackControlsView .playButton' ).hasClass( 'playerIconPlay' );
};

AmazonMusicController.prototype._getContentInfo = function()
{
    var track = $( '.trackInfoContainer .trackTitle' ).text();
    var artist = $( '.trackInfoContainer .trackArtist > a > span' ).text();
    var album = $( '.trackInfoContainer .trackSourceLink > span > a' ).text();
    var artwork = $( '.trackAlbumArt img' ).attr( 'src' );
    if( track )
    {
        return new ContentInfo( track, artist, album, artwork );
    }
    else
    {
        return null;
    }
};

$( function()
{
    var controller = new AmazonMusicController();
    controller.startPolling();
} );
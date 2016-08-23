function PandoraController()
{
    Controller.call( this, 'Pandora', '#455774' );
}

PandoraController.prototype = Object.create( Controller.prototype );
PandoraController.prototype.constructor = PandoraController;

PandoraController.prototype._play = function()
{
    $( '.playButton' ).click();
};

PandoraController.prototype._pause = function()
{
    $( '.pauseButton' ).click();
};

PandoraController.prototype._previous = function()
{
    console.log( 'Pandora does not support previous().' );
};

PandoraController.prototype._next = function()
{
    $( '.skipButton' ).click();
};

PandoraController.prototype._like = function()
{
    $( '.thumbUpButton' ).click();
};

PandoraController.prototype._unlike = function()
{
    $( '.thumbUpButton' ).click();
}

PandoraController.prototype._dislike = function()
{
    $( '.thumbDownButton' ).click();
};

PandoraController.prototype._undislike = function()
{
    $( '.thumbDownButton' ).click();
}

PandoraController.prototype._isLiked = function()
{
    return $( '.thumbUpButton' ).hasClass( 'indicator' );
};

PandoraController.prototype._isDisliked = function()
{
    return $( '.thumbDownButton' ).hasClass( 'indicator' );
};

PandoraController.prototype._getProgress = function()
{
    var elapsedTime = -trackTimeToSeconds( $( '.elapsedTime' ).text() );
    var remainingTime = trackTimeToSeconds( $( '.remainingTime' ).text() );

    var totalTime = elapsedTime + remainingTime;

    var progress = totalTime === 0 ? 0 : elapsedTime / totalTime;

    return progress
};

PandoraController.prototype._isPaused = function()
{
    return $( '.playButton' ).is( ':visible' );
};

PandoraController.prototype._getContentInfo = function()
{
    var track = $( '.playerBarSong' ).text();
    var artist = $( '.playerBarArtist' ).text();
    var album = $( '.playerBarAlbum' ).text();
    var artwork = $( 'img.art[src]' ).attr( 'src' );
    if( track )
    {
        return new ContentInfo( track, artist, album, artwork );
    }
    else
    {
        return null;
    }
};

$( window ).ready( function()
{
    window.controller = new PandoraController();
    window.controller.startPolling();
} );
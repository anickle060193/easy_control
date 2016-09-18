function GooglePlayMusicController()
{
    Controller.call( this, 'GooglePlayMusic' );

    this.color = Controller.settings[ Settings.ControllerColors.GooglePlayMusic ];

    this.initialize();
}

GooglePlayMusicController.prototype = Object.create( Controller.prototype );
GooglePlayMusicController.prototype.constructor = GooglePlayMusicController;

GooglePlayMusicController.prototype._play = function()
{
    $( '#player-bar-play-pause' ).click();
};

GooglePlayMusicController.prototype._pause = function()
{
    $( '#player-bar-play-pause' ).click();
};

GooglePlayMusicController.prototype._previous = function()
{
    $( '#player-bar-rewind' ).click();
};

GooglePlayMusicController.prototype._next = function()
{
    $( '#player-bar-forward' ).click();
};

GooglePlayMusicController.prototype._like = function()
{
    $( '.rating-container > paper-icon-button[data-rating="5"]' ).click();
};

GooglePlayMusicController.prototype._unlike = function()
{
    $( '.rating-container > paper-icon-button[data-rating="5"]' ).click();
};

GooglePlayMusicController.prototype._dislike = function()
{
    $( '.rating-container > paper-icon-button[data-rating="1"]' ).click();
};

GooglePlayMusicController.prototype._undislike = function()
{
    $( '.rating-container > paper-icon-button[data-rating="1"]' ).click();
};

GooglePlayMusicController.prototype._isLiked = function()
{
    return $( '.rating-container > paper-icon-button[data-rating="5"]' ).prop( 'title' ).startsWith( 'Undo' );
};

GooglePlayMusicController.prototype._isDisliked = function()
{
    return $( '.rating-container > paper-icon-button[data-rating="1"]' ).prop( 'title' ).startsWith( 'Undo' );
};

GooglePlayMusicController.prototype._getProgress = function()
{
    var elapsedTime = Common.parseTime( $( '#time_container_current' ).text() );
    var totalTime = Common.parseTime( $( '#time_container_duration' ).text() );

    if( totalTime === 0 )
    {
        return 0;
    }
    else
    {
        return elapsedTime / totalTime;
    }
};

GooglePlayMusicController.prototype._isPaused = function()
{
    return !$( '#player-bar-play-pause' ).hasClass( 'playing' );
};

GooglePlayMusicController.prototype.getContentInfo = function()
{
    var track = $( '#currently-playing-title' ).text();
    var artist = $( '#player-artist' ).text();
    var album = $( '.player-album' ).text();
    var artwork = $( '#playerBarArt' ).prop( 'src' );
    if( track )
    {
        var contentInfo = Controller.prototype.getContentInfo.call( this );
        contentInfo.title = track.trim();
        contentInfo.caption = artist.trim();
        contentInfo.subcaption = album.trim();
        contentInfo.image = artwork.trim();
        return contentInfo;
    }
    else
    {
        return null;
    }
};


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.GooglePlayMusic ] )
    {
        var controller = new GooglePlayMusicController();
        controller.startPolling();
    }
} );
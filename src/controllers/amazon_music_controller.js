function AmazonMusicController()
{
    Controller.call( this, 'AmazonMusic' );

    this.color = Controller.settings[ Settings.ControllerColors.AmazonMusic ];

    this.initialize();
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

AmazonMusicController.prototype.getContentInfo = function()
{
    var trackLink = $( '.trackInfoContainer .trackTitle > a' );
    var track = trackLink.text();
    var artist = $( '.trackInfoContainer .trackArtist > a > span' ).text();
    var album = $( '.trackInfoContainer .trackSourceLink > span > a' ).text();
    var artwork = $( '.trackAlbumArt img' ).prop( 'src' );
    if( track && track !== "loading ..." )
    {
        var contentInfo = Controller.prototype.getContentInfo.call( this );
        contentInfo.title = track.trim();
        contentInfo.caption = artist.trim();
        contentInfo.subcaption = album.trim();
        contentInfo.image = artwork.trim();
        contentInfo.link = trackLink.prop( 'href' ).trim();
        return contentInfo;
    }
    else
    {
        return null;
    }
};


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.AmazonMusic ] )
    {
        var controller = new AmazonMusicController();
        controller.startPolling();
    }
} );
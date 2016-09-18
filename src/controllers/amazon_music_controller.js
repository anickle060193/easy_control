class AmazonMusicController extends Controller
{
    constructor()
    {
        super( 'AmazonMusic' );

        this.color = Controller.settings[ Settings.ControllerColors.AmazonMusic ];

        this.initialize();
    }

    _play()
    {
        $( '.playbackControlsView .playButton' ).click();
    }

    _pause()
    {
        $( '.playbackControlsView .playButton' ).click();
    }

    previous()
    {
        $( '.playbackControlsView .previousButton' ).click();
    }

    next()
    {
        $( '.playbackControlsView .nextButton' ).click();
    }

    getProgress()
    {
        var scrubberBackgroundWidth = $( '.playbackControlsView .scrubberBackground' )[ 0 ].style.width;

        var progress = parseFloat( scrubberBackgroundWidth ) / 100.0;

        return progress;
    }

    isPaused()
    {
        return $( '.playbackControlsView .playButton' ).hasClass( 'playerIconPlay' );
    }

    getContentInfo()
    {
        var trackLink = $( '.trackInfoContainer .trackTitle > a' );
        var track = trackLink.text();
        var artist = $( '.trackInfoContainer .trackArtist > a > span' ).text();
        var album = $( '.trackInfoContainer .trackSourceLink > span > a' ).text();
        var artwork = $( '.trackAlbumArt img' ).prop( 'src' );
        if( track && track !== "loading ..." )
        {
            var contentInfo = super.getContentInfo();
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
    }
}


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.AmazonMusic ] )
    {
        var controller = new AmazonMusicController();
        controller.startPolling();
    }
} );
class PandoraController extends Controller
{
    constructor()
    {
        super( 'Pandora' );

        this.color = Controller.settings[ Settings.ControllerColors.Pandora ];

        this.initialize();
    }

    _play()
    {
        $( '.playButton' ).click();
    }

    pause()
    {
        $( '.pauseButton' ).click();
    }

    next()
    {
        $( '.skipButton' ).click();
    }

    _like()
    {
        $( '.thumbUpButton' ).click();
    }

    _unlike()
    {
        $( '.thumbUpButton' ).click();
    }

    _dislike()
    {
        $( '.thumbDownButton' ).click();
    }

    _undislike()
    {
        $( '.thumbDownButton' ).click();
    }

    isLiked()
    {
        return $( '.thumbUpButton' ).hasClass( 'indicator' );
    }

    isDisliked()
    {
        return $( '.thumbDownButton' ).hasClass( 'indicator' );
    }

    getProgress()
    {
        var elapsedTime = Common.parseTime( $( '.elapsedTime' ).text() );
        var remainingTime = Common.parseTime( $( '.remainingTime' ).text() );

        var totalTime = elapsedTime + remainingTime;

        if( totalTime === 0 )
        {
            return 0;
        }
        else
        {
            return elapsedTime / totalTime;
        }
    }

    isPaused()
    {
        return $( '.playButton' ).is( ':visible' );
    }

    getContentInfo()
    {
        var trackLink = $( 'a.playerBarSong' );
        var track = trackLink.text();
        var artist = $( '.playerBarArtist' ).text();
        var album = $( '.playerBarAlbum' ).text();
        var artwork = $( 'img.art[src]' ).prop( 'src' );
        if( track )
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

    openContent( content )
    {
        console.log( 'openContent is not supported.' );
    }
}


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Pandora ] )
    {
        var controller = new PandoraController();
        controller.startPolling();
    }
} );
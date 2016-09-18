class GooglePlayMusicController extends Controller
{
    constructor()
    {
        super( 'GooglePlayMusic' );

        this.color = Controller.settings[ Settings.ControllerColors.GooglePlayMusic ];

        this.initialize();
    }

    _play()
    {
        $( '#player-bar-play-pause' ).click();
    }

    _pause()
    {
        $( '#player-bar-play-pause' ).click();
    }

    previous()
    {
        $( '#player-bar-rewind' ).click();
    }

    next()
    {
        $( '#player-bar-forward' ).click();
    }

    _like()
    {
        $( '.rating-container > paper-icon-button[data-rating="5"]' ).click();
    }

    _unlike()
    {
        $( '.rating-container > paper-icon-button[data-rating="5"]' ).click();
    }

    _dislike()
    {
        $( '.rating-container > paper-icon-button[data-rating="1"]' ).click();
    }

    _undislike()
    {
        $( '.rating-container > paper-icon-button[data-rating="1"]' ).click();
    }

    isLiked()
    {
        return $( '.rating-container > paper-icon-button[data-rating="5"]' ).prop( 'title' ).startsWith( 'Undo' );
    }

    isDisliked()
    {
        return $( '.rating-container > paper-icon-button[data-rating="1"]' ).prop( 'title' ).startsWith( 'Undo' );
    }

    getProgress()
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
    }

    isPaused()
    {
        return !$( '#player-bar-play-pause' ).hasClass( 'playing' );
    }

    getContentInfo()
    {
        var track = $( '#currently-playing-title' ).text();
        var artist = $( '#player-artist' ).text();
        var album = $( '.player-album' ).text();
        var artwork = $( '#playerBarArt' ).prop( 'src' );
        if( track )
        {
            var contentInfo = super.getContentInfo();
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
    }
}


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.GooglePlayMusic ] )
    {
        var controller = new GooglePlayMusicController();
        controller.startPolling();
    }
} );
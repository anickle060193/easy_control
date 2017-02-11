class PandoraController extends Controller
{
    constructor()
    {
        super( 'Pandora' );

        this.color = Controller.settings[ Settings.ControllerColors.Pandora ];

        this.initialize();
    }

    getElement( selectors )
    {
        for( var i = 0; i < selectors.length; i++ )
        {
            var el = $( selectors[ i ] );
            if( el.length > 0 )
            {
                return el.first();
            }
        }
        return $();
    }

    _play()
    {
        this.getElement( [ '.playButton', '.PlayButton' ] ).click();
    }

    _pause()
    {
        this.getElement( [ '.pauseButton', '.PlayButton' ] ).click();
    }

    next()
    {
        this.getElement( [ '.skipButton', '.SkipButton' ] ).click();
    }

    _like()
    {
        this.getElement( [ '.thumbUpButton', '.ThumbUpButton' ] ).click();
    }

    _unlike()
    {
        this.getElement( [ '.thumbUpButton', '.ThumbUpButton' ] ).click();
    }

    _dislike()
    {
        this.getElement( [ '.thumbDownButton', '.ThumbDownButton' ] ).click();
    }

    _undislike()
    {
        this.getElement( [ '.thumbDownButton', '.ThumbDownButton' ] ).click();
    }

    isLiked()
    {
        var thumbUp = this.getElement( [ '.thumbUpButton', '.ThumbUpButton' ] );
        return thumbUp.hasClass( 'ThumbUpButton--active' ) || thumbUp.hasClass( 'indicator' );
    }

    isDisliked()
    {
        var thumbDown = this.getElement( [ '.thumbDownButton', '.ThumbDownButton' ] );
        return thumbDown.hasClass( 'ThumbDownButton--active' ) || thumbDown.hasClass( 'indicator' );
    }

    getProgress()
    {
        var duration = $( '.Duration' );
        if( duration.length > 0 )
        {
            var elapsedTime = Common.parseTime( duration.children().eq( 0 ).text() );
            var totalTime = Common.parseTime( duration.children().eq( 2 ).text() );
            if( totalTime == 0 )
            {
                return 0;
            }
            else
            {
                return elapsedTime / totalTime;
            }
        }
        else
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
    }

    isPaused()
    {
        var playButton = $( '.playButton' );
        if( playButton.length != 0 )
        {
            return playButton.is( ':visible' );
        }
        else
        {
            playButton = $( '.PlayButton' );
            return playButton.data( 'qa' ) == 'play_button'
        }
    }

    getContentInfo()
    {
        var trackLink = this.getElement( [ 'a.playerBarSong', '.nowPlayingTopInfo__current__trackName' ] );
        var track = trackLink.text();
        var artist = this.getElement( [ '.playerBarArtist', '.nowPlayingTopInfo__current__artistName' ] ).text();
        var album = this.getElement( [ '.playerBarAlbum', '.nowPlayingTopInfo__current__albumName' ] ).text();

        var artwork = '';
        var artworkImg = $( 'img.art[src]' )
        if( artworkImg.length != 0 )
        {
            artwork = artworkImg.prop( 'src' );
        }
        else
        {
            var artContainer = $( '.nowPlayingTopInfo__artContainer__art' ).first();
            if( artContainer.length != 0 )
            {
                artwork = artContainer.css( 'background-image' );
                artwork = artwork.replace( /^.*\s*url\(\s*[\'\"]?/, '' ).replace( /[\'\"]?\s*\).*/, '' );
            }
        }

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
class GooglePlayMusicController extends MediaController
{
    constructor( audio )
    {
        super( 'GooglePlayMusic', audio );

        this.color = Controller.settings[ Settings.ControllerColors.GooglePlayMusic ];

        this.initialize();
    }

    showControls()
    {
        super.showControls();

        this.controls.find( '#media-control-overlay-fullscreen' ).hide();
        this.controls.find( '#media-control-overlay-loop' ).hide();
    }

    setFullscreen( fullscreen )
    {
        console.log( 'GooglePlayMusicController does not support setting fullscreen.' );
    }

    loop( loop )
    {
        super.loop( false );

        console.log( 'GooglePlayMusicController does not support looping.' );
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
        MediaController.createSingleMediaListener( 'Google Play Music', function( audio )
        {
            if( $( document.body ).children( 'audio' ).first().is( audio ) )
            {
                return new GooglePlayMusicController( audio );
            }
            else
            {
                return null;
            }
        } );
    }
} );
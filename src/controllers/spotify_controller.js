class SpotifyController extends Controller
{
    constructor()
    {
        super( 'Spotify' );

        this.color = Controller.settings[ Settings.ControllerColors.Spotify ];

        this.initialize();
    }

    _play()
    {
        $( '#play-pause' ).click();
    }

    _pause()
    {
        $( '#play-pause' ).click();
    }

    previous()
    {
        $( '#previous' ).click();
    }

    next()
    {
        $( '#next' ).click();
    }

    getProgress()
    {
        var currentTrackTime = Common.parseTime( $( '#track-current' ).text() );
        var trackLength = Common.parseTime( $( '#track-length' ).text() );

        if( trackLength === 0 )
        {
            return 0;
        }
        else
        {
            return currentTrackTime / trackLength;
        }
    }

    isPaused()
    {
        return !$( '#play-pause' ).hasClass( 'playing' );
    }

    getContentInfo()
    {
        var trackLink = $( '#track-name > a:first' );
        var track = trackLink.text();
        var artist = $( '#track-artist > a' ).map( function()
        {
            return $( this ).text();
        } ).get().join( ', ' );
        var artwork = "";
        var artworkImg = $( '#cover-art div.sp-image-img' ).css( 'background-image' );
        if( artworkImg )
        {
            artwork = artworkImg.replace( /^.*\s*url\(\s*[\'\"]?/, '' ).replace( /[\'\"]?\s*\).*/, '' );
        }

        if( track )
        {
            var contentInfo = super.getContentInfo();
            contentInfo.title = track.trim();
            contentInfo.caption = artist.trim();
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
        console.log( 'Spotify - openContent(): ' + content );
        var newUrl = content;
        var dataUri = 'spotify:' + newUrl.replace( 'https://play.spotify.com/', '' ).split( '/' ).join( ':' );

        var a = $( `<a href="${newUrl}" data-uri="${dataUri}"></a>` )
            .text( newUrl )
            .appendTo( document.body );

        a[ 0 ].click();

        a.remove();
    }
}


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Spotify ] )
    {
        if( $( '#progress' ).length !== 0
        && $( '#play-pause' ).length !== 0
        && $( '#previous' ).length !== 0
        && $( '#next' ).length !== 0 )
        {
            var controller = new SpotifyController();
            controller.startPolling();
        }
        else
        {
            console.log( 'Bad Spotify frame.' );
        }
    }
} );
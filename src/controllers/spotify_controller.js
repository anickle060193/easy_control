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
        $( 'button.control-button[class*="spoticon-play"]' ).click();
    }

    _pause()
    {
        $( 'button.control-button[class*="spoticon-pause"]' ).click();
    }

    previous()
    {
        $( 'button.control-button[class*="spoticon-skip-back"]' ).click();
    }

    next()
    {
        $( 'button.control-button[class*="spoticon-skip-forward"]' ).click();
    }

    getProgress()
    {
        var progressBar = $( '.progress-bar__fg' );
        if( progressBar.length == 0 )
        {
            return 0;
        }
        else
        {
            return parseFloat( progressBar[ 0 ].style.width ) / 100;
        }
    }

    isPaused()
    {
        return $( 'button.control-button[class*="spoticon-play"]' ).length > 0;
    }

    getContentInfo()
    {

        var trackLink = $( '.track-info__name a' );
        var track = trackLink.text();
        var artist = $( '.track-info__artists a' ).map( function()
        {
            return $( this ).text();
        } ).get().join( ', ' );
        var artwork = "";
        var artworkImg = $( '.cover-art-image-loaded' ).css( 'background-image' );
        if( artworkImg )
        {
            artwork = artworkImg.replace( /^.*\s*url\(\s*[\'\"]?/, '' ).replace( /[\'\"]?\s*\).*/, '' );
        }

        if( track && artist && artwork )
        {
            var contentInfo = super.getContentInfo();
            contentInfo.title = track.trim();
            contentInfo.caption = artist.trim();
            contentInfo.image = artwork.trim();
            contentInfo.link = trackLink.prop( 'href' ).trim() + ' [' + contentInfo.title + ']';

            return contentInfo;
        }
        else
        {
            return null;
        }
    }

    _openLink( url )
    {
        var a = $( '<a>' )
            .prop( 'href', url )
            .appendTo( document.body );

        a[ 0 ].click();

        a.remove();
    }

    /*
    _sketchyAddToQueue( uri )
    {
        $( '<script>' )
            .prop( 'type', 'text/javascript' )
            .text( `console.log( 'Sketchily adding "${uri}" to queue.' );
                    SpotifyApi.api.request( 'player_queue_tracks_append', [ 'main', '${uri}' ] );
                    console.log( 'Sketchyness succeeded' );` )
            .appendTo( document.body )
            .remove();
    }
    */

    openContent( content )
    {
        console.log( 'Spotify - openContent(): ' + content );
        this._openLink( content );
    }
}


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Spotify ] )
    {
        var controller = new SpotifyController();
        controller.startPolling();
    }
} );
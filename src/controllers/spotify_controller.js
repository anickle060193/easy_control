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
        $( 'button.control-button.spoticon-play-32' ).click();
    }

    _pause()
    {
        $( 'button.control-button.spoticon-pause-32' ).click();
    }

    previous()
    {
        $( 'button.control-button.spoticon-skip-back-24' ).click();
    }

    next()
    {
        $( 'button.control-button.spoticon-skip-forward-24' ).click();
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
        return $( 'button.control-button.spoticon-play-32' ).length > 0;
    }

    getContentInfo()
    {

        var trackLink = $( '.now-playing-bar > div:first-child > div > :first-child > div > a' );
        var track = trackLink.text();
        var artist = $( '.now-playing-bar > div:first-child > div > :nth-child( 2 ) > span > span > a' ).map( function()
        {
            return $( this ).text();
        } ).get().join( ', ' );
        var artwork = "";
        var artworkImg = $( '.now-playing-bar .cover-art-image-loaded' ).css( 'background-image' );
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

        var splitUri = [ 'spotify' ].concat( content.replace( 'https://play.spotify.com/', '' ).split( '/' ) );

        if( splitUri.length >= 3 && splitUri[ 1 ] === 'track' )
        {
            var trackId = splitUri[ 2 ];
            $.get( 'https://api.spotify.com/v1/tracks/' + trackId, function( data )
            {
                this._openLink( data.album.external_urls.spotify );
            }.bind( this ) );
        }
        else
        {
            this._openLink( content );
        }
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
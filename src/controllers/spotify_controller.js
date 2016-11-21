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
        if( $( '#progress' ).length !== 0
        && $( '#play-pause' ).length !== 0
        && $( '#previous' ).length !== 0
        && $( '#next' ).length !== 0 )
        {
            var controller = new SpotifyController();
            controller.startPolling();
        }
    }
} );
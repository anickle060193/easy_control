class AudioVideoController extends MediaController
{
    constructor( media, color )
    {
        super( 'GenericAudioVideo', media );

        this.color = color || Controller.settings[ Settings.ControllerColors.GenericAudioVideo ];
        this.hostname = null;

        this.initialize();
    }

    openContent( content )
    {
        console.log( 'openContent is not supported' );
    }
}


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.GenericAudioVideo ] )
    {
        var color = Controller.settings[ Settings.ControllerColors.GenericAudioVideo ];
        var metaThemeColor = $( 'meta[name="theme-color"][content][content!=""]:first' );
        var metaTileColor = $( 'meta[name="msapplication-TileColor"][content][content!=""]:first' );
        if( metaThemeColor.length > 0 )
        {
            color = metaThemeColor.attr( 'content' );
        }
        else if( metaTileColor.length > 0 )
        {
            color = metaTileColor.attr( 'content' );
        }

        var url = window.location.href;
        var blacklist = Controller.settings[ Settings.SiteBlacklist ];
        for( var i = 0; i < blacklist.length; i++ )
        {
            if( blacklist[ i ] && url.includes( blacklist[ i ] ) )
            {
                console.log( 'Easy Control - Blacklisted site: ' + blacklist[ i ] );
                return;
            }
        }

        var mediaCounter = 0;
        MediaController.createMultiMediaListener( 'Generic Audio/Video', function( media )
        {
            var src = media.currentSrc;
            if( src )
            {
                for( var i = 0; i < blacklist.length; i++ )
                {
                    if( blacklist[ i ] && src.includes( blacklist[ i ] ) )
                    {
                        console.log( 'Easy Control - Blacklisted source: ' + blacklist[ i ] );
                        return null;
                    }
                }
            }

            mediaCounter++;
            return new AudioVideoController( media, color );
        } );
    }
} );
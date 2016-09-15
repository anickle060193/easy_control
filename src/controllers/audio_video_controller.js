function AudioVideoController( media, name )
{
    MediaController.call( this, media, name, Controller.settings[ Settings.ControllerColors.GenericAudioVideo ], media.nodeName !== 'VIDEO' );
}

AudioVideoController.prototype = Object.create( MediaController.prototype );
AudioVideoController.prototype.constructor = AudioVideoController;

$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.GenericAudioVideo ] )
    {
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

        var name = window.location.hostname.split( '.' ).join( '' );
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
            return new AudioVideoController( media, name + '_' + mediaCounter );
        } );
    }
} );
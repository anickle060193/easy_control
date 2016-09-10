function AudioVideoController( media, name )
{
    MediaController.call( this, media, name, '#5b5b5b' );

    this.allowLockOnInactivity = false;
}

AudioVideoController.prototype = Object.create( MediaController.prototype );
AudioVideoController.prototype.constructor = AudioVideoController;

$( function()
{
    var url = window.location.href;
    var blacklist = Controller.settings[ Settings.SiteBlacklist ];
    for( var i = 0; i < blacklist.length; i++ )
    {
        if( blacklist[ i ] && url.indexOf( blacklist[ i ] ) !== -1 )
        {
            console.log( 'Easy Control - Blacklisted site: ' + blacklist[ i ] );
            return;
        }
    }

    var name = window.location.hostname.split( '.' ).join( '' );
    var i = 0;
    MediaController.createMultiMediaListener( 'Generic Audio/Video', function( media )
    {
        i++;
        return new AudioVideoController( media, name + '_' + i.toString() );
    } );
} );
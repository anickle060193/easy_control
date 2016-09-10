function AmazonVideoController( video )
{
    MediaController.call( this, video, 'AmazonVideo', '#FF9900' );

    this.allowLockOnInactivity = false;
}

AmazonVideoController.prototype = Object.create( MediaController.prototype );
AmazonVideoController.prototype.constructor = AmazonVideoController;

AmazonVideoController.prototype._getContentInfo = function()
{
    var title = $( '#aiv-content-title' )[ 0 ].childNodes[ 0 ].nodeValue;
    var thumbnail = $( 'meta[property="og:image"]' ).attr( 'content' );

    if( title )
    {
        return new ContentInfo( title, "", "", thumbnail );
    }
    else
    {
        return null;
    }
};

$( function()
{
    MediaController.createSingleMediaListener( 'Amazon Video', function( media )
    {
        return new AmazonVideoController( media );
    } );
} );
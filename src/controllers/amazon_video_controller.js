function AmazonVideoController( video )
{
    MediaController.call( this, 'AmazonVideo', video );

    this.color = Controller.settings[ Settings.ControllerColors.AmazonVideo ];
    this.hostname = null;

    this.initialize();
}

AmazonVideoController.prototype = Object.create( MediaController.prototype );
AmazonVideoController.prototype.constructor = AmazonVideoController;

AmazonVideoController.prototype.getContentInfo = function()
{
    var title = $( '#aiv-content-title' )[ 0 ].childNodes[ 0 ].nodeValue;
    var thumbnail = $( 'meta[property="og:image"]' ).prop( 'content' );

    if( title )
    {
        var contentInfo = MediaController.prototype.getContentInfo.call( this );
        contentInfo.title = title.trim();
        contentInfo.image = thumbnail.trim();
        return contentInfo;
    }
    else
    {
        return null;
    }
};

AmazonVideoController.prototype.openContent = function( content )
{
    console.log( 'openContent is not supported.' );
};


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.AmazonVideo ] )
    {
        MediaController.createSingleMediaListener( 'Amazon Video', function( media )
        {
            return new AmazonVideoController( media );
        } );
    }
} );
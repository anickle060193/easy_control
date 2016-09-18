class AmazonVideoController extends MediaController
{
    constructor( video )
    {
        super( 'AmazonVideo', video );

        this.color = Controller.settings[ Settings.ControllerColors.AmazonVideo ];
        this.hostname = null;

        this.initialize();
    }

    getContentInfo()
    {
        var title = $( '#aiv-content-title' )[ 0 ].childNodes[ 0 ].nodeValue;
        var thumbnail = $( 'meta[property="og:image"]' ).prop( 'content' );

        if( title )
        {
            var contentInfo = super.getContentInfo();
            contentInfo.title = title.trim();
            contentInfo.image = thumbnail.trim();
            return contentInfo;
        }
        else
        {
            return null;
        }
    }

    openContent( content )
    {
        console.log( 'openContent is not supported.' );
    }
}


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
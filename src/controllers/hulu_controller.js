function HuluController( video )
{
    MediaController.call( this, 'Hulu', video );

    this.color = Controller.settings[ Settings.ControllerColors.Hulu ];

    this.initialize();
}

HuluController.prototype = Object.create( MediaController.prototype );
HuluController.prototype.constructor = HuluController;

HuluController.prototype._play = function()
{
    $( '.controls-bar .play-pause-button' ).click();
};

HuluController.prototype._pause = function()
{
    $( '.controls-bar .play-pause-button' ).click();
};

HuluController.prototype._next = function()
{
    $( '.controls-bar .next-video-button' ).click();
};

HuluController.prototype._getContentInfo = function()
{
    var episodeTitle = $( '.video-description .episode-title' ).text();
    var showTitle = $( '.video-description .show-title' ).text();
    var thumbnail = $( 'meta[property="og:image"]' ).attr( 'content' );

    if( episodeTitle )
    {
        return new ContentInfo( episodeTitle, showTitle, "", thumbnail );
    }
    else
    {
        return null;
    }
};


$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Hulu ] )
    {
        MediaController.createMultiMediaListener( 'Hulu', function( media )
        {
            return new HuluController( media );
        } );
    }
} );
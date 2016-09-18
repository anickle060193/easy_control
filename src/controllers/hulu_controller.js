class HuluController extends MediaController
{
    constructor( video )
    {
        super( 'Hulu', video );

        this.color = Controller.settings[ Settings.ControllerColors.Hulu ];

        this.initialize();
    }

    _play()
    {
        $( '.controls-bar .play-pause-button' ).click();
    }

    _pause()
    {
        $( '.controls-bar .play-pause-button' ).click();
    }

    next()
    {
        $( '.controls-bar .next-video-button' ).click();
    }

    getContentInfo()
    {
        var episodeTitle = $( '.video-description .episode-title' ).text();
        var showTitle = $( '.video-description .show-title' ).text();
        var thumbnail = $( 'meta[property="og:image"]' ).prop( 'content' );

        if( episodeTitle )
        {
            var contentInfo = super.getContentInfo();
            contentInfo.title = episodeTitle.trim();
            contentInfo.caption = showTitle.trim();
            contentInfo.image = thumbnail.trim();
            return contentInfo;
        }
        else
        {
            return null;
        }
    }
}


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
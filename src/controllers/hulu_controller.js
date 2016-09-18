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
        var mainTitle = $( '.video-description .episode-title' ).text();
        var subTitle = $( '.video-description .show-title' ).text();
        var thumbnail = '';

        var nowPlaying = $( '.now-playing' );
        if( nowPlaying.length > 0 )
        {
            thumbnail = nowPlaying.parent().parent().find( '.thumbnail img' ).prop( 'src' );
        }
        else
        {
            var metaTitle = $( 'meta[property="og:title"]' ).prop( 'content' );
            if( metaTitle.includes( mainTitle ) || mainTitle.includes( metaTitle ) )
            {
                thumbnail = $( 'meta[property="og:image"]' ).prop( 'content' );
            }
        }

        if( mainTitle && thumbnail )
        {
            var contentInfo = super.getContentInfo();
            contentInfo.title = mainTitle.trim();
            contentInfo.caption = subTitle.trim();
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
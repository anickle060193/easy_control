class YoutubeController extends MediaController
{
    constructor( video )
    {
        super( 'Youtube', video );

        this.color = Controller.settings[ Settings.ControllerColors.Youtube ];

        this.hasBeenActivated = this.active;

        this.initialize();
    }

    activate()
    {
        super.activate();

        this.hasBeenActivated = true;
    }

    _pause()
    {
        if( this.hasBeenActivated )
        {
            super._pause();
        }
    }

    next()
    {
        $( '.ytp-next-button' ).click();
    }

    isPaused()
    {
        return !this.hasBeenActivated || super.isPaused();
    }

    _like()
    {
        $( 'button.like-button-renderer-like-button.like-button-renderer-like-button-unclicked' ).click();
    }

    _unlike()
    {
        $( 'button.like-button-renderer-like-button.like-button-renderer-like-button-clicked' ).click();
    }

    _dislike()
    {
        $( 'button.like-button-renderer-dislike-button.like-button-renderer-dislike-button-unclicked' ).click();
    }

    _undislike()
    {
        $( 'button.like-button-renderer-dislike-button.like-button-renderer-dislike-button-clicked' ).click();
    }

    isLiked()
    {
        return !$( 'button.like-button-renderer-like-button.like-button-renderer-like-button-clicked' ).hasClass( 'hid' );
    }

    isDisliked()
    {
        return !$( 'button.like-button-renderer-dislike-button.like-button-renderer-dislike-button-clicked' ).hasClass( 'hid' );
    }

    getContentInfo()
    {
        var videoTitle = $( '.watch-title' ).text();
        var channel = $( '.spf-link a' ).text();
        var thumbnailImg = $( '#watch-header img' );

        if( videoTitle && thumbnailImg.length > 0 && thumbnailImg.prop( 'naturalHeight' ) > 10 )
        {
            var contentInfo = super.getContentInfo();
            contentInfo.title = videoTitle.trim();
            contentInfo.caption = channel.trim();
            contentInfo.image = thumbnailImg.prop( 'src' ).trim();
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
    if( Controller.settings[ Settings.ControllersEnabled.Youtube ] )
    {
        MediaController.createSingleMediaListener( 'Youtube', function( media )
        {
            return new YoutubeController( media );
        } );
    }
} );
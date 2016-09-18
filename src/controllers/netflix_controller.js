class NetflixController extends MediaController
{
    constructor( video )
    {
        super( 'Netflix', video );

        this.color = Controller.settings[ Settings.ControllerColors.Netflix ];

        this.initialize();
    }

    _play()
    {
        $( '.player-control-button.player-play-pause' ).click();
    }

    _pause()
    {
        $( '.player-control-button.player-play-pause' ).click();
    }

    next()
    {
        $( '.player-control-button.player-next-episode' ).click();
    }

    getContentInfo()
    {
        var title = $( '.player-status-main-title' ).text();

        if( title )
        {
            var contentInfo = super.getContentInfo();
            contentInfo.title = title.trim();

            var playerStatusChildren = $( '.player-status' ).children();
            if( playerStatusChildren.length > 1 )
            {
                contentInfo.caption = playerStatusChildren.eq( 1 ).text().trim();
                contentInfo.subcaption = playerStatusChildren.eq( 2 ).text().trim();
            }

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
    if( Controller.settings[ Settings.ControllersEnabled.Netflix ] )
    {
        MediaController.createSingleMediaListener( 'Netflix', function( media )
        {
            return new NetflixController( media );
        } );
    }
} );
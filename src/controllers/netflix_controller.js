function NetflixController( video )
{
    MediaController.call( this, 'Netflix', video );

    this.color = Controller.settings[ Settings.ControllerColors.Netflix ];

    this.initialize();
}

NetflixController.prototype = Object.create( MediaController.prototype );
NetflixController.prototype.constructor = NetflixController;

NetflixController.prototype._play = function()
{
    $( '.player-control-button.player-play-pause' ).click();
};

NetflixController.prototype._pause = function()
{
    $( '.player-control-button.player-play-pause' ).click();
};

NetflixController.prototype._next = function()
{
    $( '.player-control-button.player-next-episode' ).click();
};

NetflixController.prototype.getContentInfo = function()
{
    var title = $( '.player-status-main-title' ).text();

    if( title )
    {
        var contentInfo = MediaController.prototype.getContentInfo.call( this );
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
};


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
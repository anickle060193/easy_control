function TwitchController()
{
    Controller.call( this, 'Twitch' );

    this.color = Controller.settings[ Settings.ControllerColors.Twitch ];
    this.allowPauseOnInactivity = false;

    this.initialize();
}

TwitchController.prototype = Object.create( Controller.prototype );
TwitchController.prototype.constructor = TwitchController;

TwitchController.prototype._play = function()
{
    $( 'button.player-button--playpause' ).click();
};

TwitchController.prototype._pause = function()
{
    $( 'button.player-button--playpause' ).click();
};

TwitchController.prototype._getProgress = function()
{
    if( $( '.player-livestatus__online' ).css( 'display' ) === 'none' )
    {
        var currentTime = Common.parseTime( $( '.js-seek-currenttime' ).text() );
        var totalTime = Common.parseTime( $( '.js-seek-totaltime' ).text() );

        if( totalTime === 0 )
        {
            return 0;
        }
        else
        {
            return currentTime / totalTime;
        }
    }
    else
    {
        return 0.0;
    }
};

TwitchController.prototype._isPaused = function()
{
    return $( 'button.player-button--playpause > .play-button' ).css( 'display' ) !== 'none';
};

TwitchController.prototype._getContentInfo = function()
{
    var title = $( '.info > .title' ).text();
    var streamer = $( '.channel-name' ).text();
    var artwork = $( '.profile-photo > img' ).prop( 'src' );

    if( title && streamer && artwork )
    {
        return new ContentInfo( title, streamer, "", artwork );
    }
    else
    {
        return null;
    }
};

$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Twitch ] )
    {
        var controller = new TwitchController();
        controller.startPolling();
    }
} );
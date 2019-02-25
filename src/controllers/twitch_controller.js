class TwitchController extends Controller
{
  constructor()
  {
    super( 'Twitch' );

    this.color = settings.get( SettingKey.ControllerColors.Twitch );
    this.allowPauseOnInactivity = false;

    this.initialize();
  }

  playImpl()
  {
    $( 'button.player-button--playpause' ).click();
  }

  pauseImpl()
  {
    $( 'button.player-button--playpause' ).click();
  }

  getProgress()
  {
    if( $( '.player-livestatus__online' ).css( 'display' ) === 'none' )
    {
      let currentTime = Common.parseTime( $( '.js-seek-currenttime' ).text() );
      let totalTime = Common.parseTime( $( '.js-seek-totaltime' ).text() );

      if( totalTime === 0 )
      {
        return 0.0;
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
  }

  isPaused()
  {
    return $( 'button.player-button--playpause > .play-button' ).css( 'display' ) !== 'none';
  }

  getContentInfo()
  {
    let title = $( '.info > .title' ).text();
    let streamer = $( '.channel-name' ).text();
    let artwork = $( '.profile-photo > img' ).prop( 'src' );

    if( title && streamer && artwork )
    {
      let contentInfo = super.getContentInfo();
      contentInfo.title = title.trim();
      contentInfo.caption = streamer.trim();
      contentInfo.image = artwork.trim();
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
  if( settings.get( SettingKey.ControllersEnabled.Twitch ) )
  {
    let controller = new TwitchController();
    controller.startPolling();
  }
} );

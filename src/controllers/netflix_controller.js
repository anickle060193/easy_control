class NetflixController extends MediaController
{
  constructor( video )
  {
    super( 'Netflix', video );

    this.color = settings.get( SettingKey.ControllerColors.Netflix );

    this.initialize();
  }

  playImpl()
  {
    $( '.player-control-button.player-play-pause' ).click();
  }

  pauseImpl()
  {
    $( '.player-control-button.player-play-pause' ).click();
  }

  next()
  {
    $( '.player-control-button.player-next-episode' ).click();
  }

  getContentInfo()
  {
    let title = $( '.player-status-main-title' ).text();

    if( title )
    {
      let contentInfo = super.getContentInfo();
      contentInfo.title = title.trim();

      let playerStatusChildren = $( '.player-status' ).children();
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
  if( settings.get( SettingKey.ControllersEnabled.Netflix ) )
  {
    MediaController.createSingleMediaListener( 'Netflix', function( media )
    {
      return new NetflixController( media );
    } );
  }
} );

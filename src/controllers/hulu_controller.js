class HuluController extends MediaController
{
  constructor( video )
  {
    super( 'Hulu', video );

    this.color = settings.get( SettingKey.ControllerColors.Hulu );

    this.initialize();
  }

  playImpl()
  {
    $( '.controls-bar .play-pause-button' ).click();
  }

  pauseImpl()
  {
    $( '.controls-bar .play-pause-button' ).click();
  }

  next()
  {
    $( '.controls-bar .next-video-button' ).click();
  }

  getContentInfo()
  {
    let mainTitle = $( '.video-description .episode-title' ).text();
    let subTitle = $( '.video-description .show-title' ).text();
    let thumbnail = '';

    let nowPlaying = $( '.now-playing' );
    if( nowPlaying.length > 0 )
    {
      thumbnail = nowPlaying.parent().parent().find( '.thumbnail img' ).prop( 'src' );
    }
    else
    {
      let metaTitle = $( 'meta[property="og:title"]' ).prop( 'content' );
      if( metaTitle.includes( mainTitle ) || mainTitle.includes( metaTitle ) )
      {
        thumbnail = $( 'meta[property="og:image"]' ).prop( 'content' );
      }
    }

    if( mainTitle && thumbnail )
    {
      let contentInfo = super.getContentInfo();
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
  if( settings.get( SettingKey.ControllersEnabled.Hulu ) )
  {
    MediaController.createMultiMediaListener( 'Hulu', function( media )
    {
      return new HuluController( media );
    } );
  }
} );

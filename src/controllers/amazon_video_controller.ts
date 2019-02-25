class AmazonVideoController extends MediaController
{
  constructor( video )
  {
    super( 'AmazonVideo', video );

    this.color = settings.get( SettingKey.ControllerColors.AmazonVideo );
    this.hostname = null;

    this.initialize();
  }

  getContentInfo()
  {
    let title = $( '#aiv-content-title' )[ 0 ].childNodes[ 0 ].nodeValue;
    let thumbnail = $( 'meta[property="og:image"]' ).prop( 'content' );

    if( title )
    {
      let contentInfo = super.getContentInfo();
      contentInfo.title = title.trim();
      contentInfo.image = thumbnail.trim();
      return contentInfo;
    }
    else
    {
      return null;
    }
  }

  openContentLink( contentLink )
  {
    console.log( 'openContentLink is not supported.' );
  }
}


$( function()
{
  if( AmazonVideoController.settings.get( SettingKey.ControllersEnabled.AmazonVideo ) )
  {
    MediaController.createSingleMediaListener( 'Amazon Video', function( media )
    {
      return new AmazonVideoController( media );
    } );
  }
} );

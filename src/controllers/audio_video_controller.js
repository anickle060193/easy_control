class AudioVideoController extends MediaController
{
  constructor( media, color )
  {
    super( 'GenericAudioVideo', media );

    this.color = color || Controller.settings[ Settings.ControllerColors.GenericAudioVideo ];
    this.hostname = null;

    this.initialize();
  }

  openContentLink( contentLink )
  {
    console.log( 'openContentLink is not supported' );
  }
}


$( function()
{
  if( Controller.settings[ Settings.ControllersEnabled.GenericAudioVideo ] )
  {
    let color = Controller.settings[ Settings.ControllerColors.GenericAudioVideo ];
    let metaThemeColor = $( 'meta[name="theme-color"][content][content!=""]:first' );
    let metaTileColor = $( 'meta[name="msapplication-TileColor"][content][content!=""]:first' );
    if( metaThemeColor.length > 0 )
    {
      color = metaThemeColor.attr( 'content' );
    }
    else if( metaTileColor.length > 0 )
    {
      color = metaTileColor.attr( 'content' );
    }

    let url = window.location.href;
    let blacklist = Controller.settings[ Settings.SiteBlacklist ];
    for( let i = 0; i < blacklist.length; i++ )
    {
      if( blacklist[ i ] && url.includes( blacklist[ i ] ) )
      {
        console.log( 'Easy Control - Blacklisted site: ' + blacklist[ i ] );
        return;
      }
    }

    let mediaCounter = 0;
    MediaController.createMultiMediaListener( 'Generic Audio/Video', function( media )
    {
      let src = media.currentSrc;
      if( src )
      {
        for( let i = 0; i < blacklist.length; i++ )
        {
          if( blacklist[ i ] && src.includes( blacklist[ i ] ) )
          {
            console.log( 'Easy Control - Blacklisted source: ' + blacklist[ i ] );
            return null;
          }
        }
      }

      mediaCounter++;
      return new AudioVideoController( media, color );
    } );
  }
} );

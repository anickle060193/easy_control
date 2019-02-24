class GooglePlayMusicController extends MediaController
{
  constructor( audio )
  {
    super( 'GooglePlayMusic', audio );

    this.color = Controller.settings[ SettingKey.ControllerColors.GooglePlayMusic ];

    this.initialize();
  }

  showControls()
  {
    super.showControls();

    this.controls.find( '#media-control-overlay-fullscreen' ).hide();
    this.controls.find( '#media-control-overlay-loop' ).hide();
  }

  setFullscreen( fullscreen )
  {
    console.log( 'GooglePlayMusicController does not support setting fullscreen.' );
  }

  loop( loop )
  {
    super.loop( false );

    console.log( 'GooglePlayMusicController does not support looping.' );
  }

  onPlay()
  {
    $( '#player-bar-play-pause' ).click();
  }

  onPause()
  {
    $( '#player-bar-play-pause' ).click();
  }

  previous()
  {
    $( '#player-bar-rewind' ).click();
  }

  next()
  {
    $( '#player-bar-forward' ).click();
  }

  onLike()
  {
    $( '.rating-container > paper-icon-button[data-rating="5"]' ).click();
  }

  onUnlike()
  {
    $( '.rating-container > paper-icon-button[data-rating="5"]' ).click();
  }

  onDislike()
  {
    $( '.rating-container > paper-icon-button[data-rating="1"]' ).click();
  }

  onUndislike()
  {
    $( '.rating-container > paper-icon-button[data-rating="1"]' ).click();
  }

  isLiked()
  {
    return $( '.rating-container > paper-icon-button[data-rating="5"]' ).prop( 'title' ).startsWith( 'Undo' );
  }

  isDisliked()
  {
    return $( '.rating-container > paper-icon-button[data-rating="1"]' ).prop( 'title' ).startsWith( 'Undo' );
  }

  getContentInfo()
  {
    let track = $( '#currently-playing-title' ).text();
    let artist = $( '#player-artist' ).text();
    let album = $( '.player-album' ).text();
    let artwork = $( '#playerBarArt' ).prop( 'src' );
    if( track )
    {
      let contentInfo = super.getContentInfo();
      contentInfo.title = track.trim();
      contentInfo.caption = artist.trim();
      contentInfo.subcaption = album.trim();
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
  if( Controller.settings[ SettingKey.ControllersEnabled.GooglePlayMusic ] )
  {
    MediaController.createSingleMediaListener( 'Google Play Music', function( audio )
    {
      if( $( document.body ).children( 'audio' ).first().is( audio ) )
      {
        return new GooglePlayMusicController( audio );
      }
      else
      {
        return null;
      }
    } );
  }
} );

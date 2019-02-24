class YoutubeController extends MediaController
{
  constructor( video )
  {
    super( 'Youtube', video );

    this.color = Controller.settings[ SettingKey.ControllerColors.Youtube ];

    this.hasBeenActivated = this.active;

    this.initialize();
  }

  activate()
  {
    super.activate();

    this.hasBeenActivated = true;
  }

  setFullscreen( fullscreen )
  {
    console.log( 'YoutubeController does not support setting fullscreen.' );
  }

  showControls()
  {
    super.showControls();

    this.controls.find( '#media-control-overlay-fullscreen' ).hide();
  }

  onPause()
  {
    if( this.hasBeenActivated )
    {
      super.onPause();
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

  onLike()
  {
    $( 'button.like-button-renderer-like-button.like-button-renderer-like-button-unclicked' ).click();
  }

  onUnlike()
  {
    $( 'button.like-button-renderer-like-button.like-button-renderer-like-button-clicked' ).click();
  }

  onDislike()
  {
    $( 'button.like-button-renderer-dislike-button.like-button-renderer-dislike-button-unclicked' ).click();
  }

  onUndislike()
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
    let videoTitle = $( '.watch-title' ).text();
    let channel = $( '.spf-link a' ).text();
    let thumbnailImg = $( '#watch-header img' );

    if( videoTitle && thumbnailImg.length > 0 && thumbnailImg.prop( 'naturalHeight' ) > 10 )
    {
      let contentInfo = super.getContentInfo();
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
  if( Controller.settings[ SettingKey.ControllersEnabled.Youtube ] )
  {
    MediaController.createSingleMediaListener( 'Youtube', function( media )
    {
      return new YoutubeController( media );
    } );
  }
} );

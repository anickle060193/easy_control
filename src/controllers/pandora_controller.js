class PandoraController extends Controller
{
  constructor()
  {
    super( 'Pandora' );

    this.color = Controller.settings[ Settings.ControllerColors.Pandora ];
    this.lastAlbum = null;
    this.lastArtwork = null;

    this.initialize();
  }

  getElement( selectors )
  {
    for( let i = 0; i < selectors.length; i++ )
    {
      let el = $( selectors[ i ] );
      if( el.length > 0 )
      {
        return el.first();
      }
    }
    return $();
  }

  _play()
  {
    this.getElement( [ '.playButton', '.PlayButton' ] ).click();
  }

  _pause()
  {
    this.getElement( [ '.pauseButton', '.PlayButton' ] ).click();
  }

  next()
  {
    this.getElement( [ '.skipButton', '.SkipButton' ] ).click();
  }

  _like()
  {
    this.getElement( [ '.thumbUpButton', '.ThumbUpButton' ] ).click();
  }

  _unlike()
  {
    this.getElement( [ '.thumbUpButton', '.ThumbUpButton' ] ).click();
  }

  _dislike()
  {
    this.getElement( [ '.thumbDownButton', '.ThumbDownButton' ] ).click();
  }

  _undislike()
  {
    this.getElement( [ '.thumbDownButton', '.ThumbDownButton' ] ).click();
  }

  isLiked()
  {
    let thumbUp = this.getElement( [ '.thumbUpButton', '.ThumbUpButton' ] );
    return thumbUp.hasClass( 'ThumbUpButton--active' ) || thumbUp.hasClass( 'indicator' );
  }

  isDisliked()
  {
    let thumbDown = this.getElement( [ '.thumbDownButton', '.ThumbDownButton' ] );
    return thumbDown.hasClass( 'ThumbDownButton--active' ) || thumbDown.hasClass( 'indicator' );
  }

  getProgress()
  {
    let duration = $( '.Duration' );
    if( duration.length > 0 )
    {
      let elapsedTime = Common.parseTime( duration.children().eq( 0 ).text() );
      let totalTime = Common.parseTime( duration.children().eq( 2 ).text() );
      if( totalTime == 0 )
      {
        return 0;
      }
      else
      {
        return elapsedTime / totalTime;
      }
    }
    else
    {
      let elapsedTime = Common.parseTime( $( '.elapsedTime' ).text() );
      let remainingTime = Common.parseTime( $( '.remainingTime' ).text() );

      let totalTime = elapsedTime + remainingTime;

      if( totalTime === 0 )
      {
        return 0;
      }
      else
      {
        return elapsedTime / totalTime;
      }
    }
  }

  isPaused()
  {
    let playButton = $( '.playButton' );
    if( playButton.length != 0 )
    {
      return playButton.is( ':visible' );
    }
    else
    {
      playButton = $( '.PlayButton' );
      return playButton.data( 'qa' ) == 'play_button'
    }
  }

  getContentInfo()
  {
    let trackLink = this.getElement( [ 'a.playerBarSong', '.nowPlayingTopInfo__current__trackName' ] );
    let trackItem = trackLink.find( '.Marquee__wrapper__content__child:first' );
    if( trackItem.length == 0 )
    {
      trackItem = trackLink;
    }
    let track = trackItem.text();
    let artist = this.getElement( [ '.playerBarArtist', '.nowPlayingTopInfo__current__artistName' ] ).text();
    let album = this.getElement( [ '.playerBarAlbum', '.nowPlayingTopInfo__current__albumName' ] ).text();

    let artwork = '';
    let artworkImg = $( 'img.art[src]' )
    if( artworkImg.length != 0 )
    {
      artwork = artworkImg.prop( 'src' );
    }
    else
    {
      let artContainer = $( '.nowPlayingTopInfo__artContainer__art' ).first();
      if( artContainer.length != 0 )
      {
        artwork = artContainer.css( 'background-image' );
        artwork = artwork.replace( /^.*\s*url\(\s*[\'\"]?/, '' ).replace( /[\'\"]?\s*\).*/, '' );
      }
    }

    if( album != this.lastAlbum
      && artwork == this.lastArtwork )
    {
      return null;
    }

    this.lastAlbum = album;
    this.lastArtwork = artwork;

    if( track )
    {
      let contentInfo = super.getContentInfo();
      contentInfo.title = track.trim();
      contentInfo.caption = artist.trim();
      contentInfo.subcaption = album.trim();
      contentInfo.image = artwork.trim();
      contentInfo.link = trackLink.prop( 'href' ).trim();
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
  if( Controller.settings[ Settings.ControllersEnabled.Pandora ] )
  {
    let controller = new PandoraController();
    controller.startPolling();
  }
} );

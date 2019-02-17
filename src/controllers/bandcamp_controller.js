class BandcampController extends Controller
{
  constructor()
  {
    super( 'Bandcamp' )

    this.color = Controller.settings[ Settings.ControllerColors.Bandcamp ];
    this.hostname = 'bandcamp.com';

    this.initialize();
  }

  _play()
  {
    $( '.playbutton' ).click();
  }

  _pause()
  {
    $( '.playbutton' ).click();
  }

  previous()
  {
    $( '.prevbutton' ).click();
  }

  next()
  {
    $( '.nextbutton' ).click();
  }

  getProgress()
  {
    let elapsedTime = Common.parseTime( $( '.time_elapsed' ).text() );
    let totalTime = Common.parseTime( $( '.time_total' ).text() );

    if( totalTime === 0 )
    {
      return 0;
    }
    else
    {
      return elapsedTime / totalTime;
    }
  }

  isPaused()
  {
    return !$( '.playbutton' ).hasClass( 'playing' );
  }

  getContentInfo()
  {
    let track, artist, album, artwork;
    if( $( 'h2.trackTitle' ).length !== 0 )
    {
      track = $( '.track_info .title' ).text();
      artist = $( '[itemprop=byArtist] > a' ).text();
      album = $( 'h2.trackTitle' ).text();
      artwork = $( '#tralbumArt img' ).prop( 'src' );
    }
    else
    {
      track = $( '.title' ).text();
      artist = $( '.detail-artist > a' ).text();
      album = $( '.detail-album > a' ).text();
      artwork = $( '.detail-art > img' ).prop( 'src' );
    }

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
  if( Controller.settings[ Settings.ControllersEnabled.Bandcamp ] )
  {
    let controller = new BandcampController();
    controller.startPolling();
  }
} );

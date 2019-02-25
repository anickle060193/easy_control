import { Controller } from "./controller";
import { SettingKey } from "../common/settings";

class AmazonMusicController extends Controller
{
  constructor()
  {
    super( 'AmazonMusic' );

    this.color = settings.get( SettingKey.ControllerColors.AmazonMusic )!;

    this.initialize();
  }

  playImpl()
  {
    $( '.playbackControlsView .playButton' ).click();
  }

  pauseImpl()
  {
    $( '.playbackControlsView .playButton' ).click();
  }

  previous()
  {
    $( '.playbackControlsView .previousButton' ).click();
  }

  next()
  {
    $( '.playbackControlsView .nextButton' ).click();
  }

  getProgress()
  {
    let scrubberBackgroundWidth = $( '.playbackControlsView .scrubberBackground' )[ 0 ].style.width!;

    let progress = parseFloat( scrubberBackgroundWidth ) / 100.0;

    return progress;
  }

  isPaused()
  {
    return $( '.playbackControlsView .playButton' ).hasClass( 'playerIconPlay' );
  }

  getContentInfo()
  {
    let trackLink = $( '.trackInfoContainer .trackTitle > a' );
    let track = trackLink.text();
    let artist = $( '.trackInfoContainer .trackArtist > a > span' ).text();
    let album = $( '.trackInfoContainer .trackSourceLink > span > a' ).text();
    let artwork = $( '.trackAlbumArt img' ).prop( 'src' );
    if( track && track !== "loading ..." )
    {
      let contentInfo = super.getContentInfo()!;
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
}

$( function()
{
  if( AmazonMusicController.settings.get( SettingKey.ControllersEnabled.AmazonMusic ) )
  {
    let controller = new AmazonMusicController();
    controller.startPolling();
  }
} );

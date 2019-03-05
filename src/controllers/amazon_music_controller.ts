import { Controller } from 'controllers/controller';

import { SettingKey, Sites, settings } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

class AmazonMusicController extends Controller
{
  constructor()
  {
    super( Sites.AmazonMusic );

    this.color = settings.get( SettingKey.ControllerColors.AmazonMusic );

    this.supportedOperations = {
      ...this.supportedOperations,
      playPause: true,
      previous: true,
      next: true,
    };
  }

  protected playImpl()
  {
    select( '.playbackControlsView .playButton' ).click();
  }

  protected pauseImpl()
  {
    select( '.playbackControlsView .playButton' ).click();
  }

  protected previous()
  {
    select( '.playbackControlsView .previousButton' ).click();
  }

  protected next()
  {
    select( '.playbackControlsView .nextButton' ).click();
  }

  protected getProgress()
  {
    let scrubberBackgroundWidth = select( '.playbackControlsView .scrubberBackground' ).index( 0 ).css( 'width', '0%' );

    let progress = parseFloat( scrubberBackgroundWidth ) / 100.0;

    return progress;
  }

  protected isPaused()
  {
    return select( '.playbackControlsView .playButton' ).hasClass( 'playerIconPlay' );
  }

  protected getContentInfo()
  {
    let trackLink = select<HTMLAnchorElement>( '.trackInfoContainer .trackTitle > a' );
    let track = trackLink.text();
    let link = trackLink.prop( 'href', '' );
    let artist = select( '.trackInfoContainer .trackArtist > a > span' ).text();
    let album = select( '.trackInfoContainer .trackSourceLink > span > a' ).text();
    let artwork = select<HTMLImageElement>( '.trackAlbumArt img' ).prop( 'src', '' );

    if( track && track !== 'loading ...' && artwork )
    {
      let contentInfo: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: track,
        caption: artist,
        subcaption: album,
        image: artwork,
        link: link,
      };
      return contentInfo;
    }
    else
    {
      return null;
    }
  }
}

settings.initialize().then( () =>
{
  if( settings.get( SettingKey.ControllersEnabled.AmazonMusic ) )
  {
    let controller = new AmazonMusicController();
    controller.startPolling();
  }
} );

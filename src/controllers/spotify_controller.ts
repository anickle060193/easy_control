import { Controller } from 'controllers/controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { parseTime, cssUrlToUrl } from 'common/utilities';
import { ContentInfo } from 'common/content';

class SpotifyController extends Controller
{
  constructor()
  {
    super( Sites.Spotify );

    this.color = settings.get( SettingKey.ControllerColors.Spotify );

    this.initialize();
  }

  protected playImpl()
  {
    select( '.Root__now-playing-bar button.control-button[class*="spoticon-play"]' ).click();
  }

  protected pauseImpl()
  {
    select( '.Root__now-playing-bar button.control-button[class*="spoticon-pause"]' ).click();
  }

  protected previous()
  {
    select( '.Root__now-playing-bar button.control-button[class*="spoticon-skip-back"]' ).click();
  }

  protected next()
  {
    select( '.Root__now-playing-bar button.control-button[class*="spoticon-skip-forward"]' ).click();
  }

  protected getProgress()
  {
    let elapsedTime = parseTime( select( '.Root__now-playing-bar .playback-bar__progress-time' ).index( 0 ).text() );
    let totalTime = parseTime( select( '.Root__now-playing-bar .playback-bar__progress-time' ).index( 1 ).text() );
    if( totalTime === 0 )
    {
      return 0;
    }
    else
    {
      return elapsedTime / totalTime;
    }
  }

  protected isPaused()
  {
    return select( '.Root__now-playing-bar button.control-button[class*="spoticon-play"]' ).length > 0;
  }

  protected getContentInfo()
  {
    let trackLink = select( '.Root__now-playing-bar .track-info__name a' );
    let track = trackLink.text();
    let trackUrl = trackLink.filter( ( e ): e is HTMLAnchorElement => e instanceof HTMLAnchorElement ).prop( 'href' ) || '';

    let artist = select( '.Root__now-playing-bar .track-info__artists' ).text();

    let artwork = select( '.Root__now-playing-bar .cover-art-image' ).css( 'backgroundImage' );
    artwork = cssUrlToUrl( artwork || '' );

    if( track && artist && artwork )
    {
      let content: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: track,
        caption: artist,
        image: artwork,
        link: `${trackUrl} [${track}]`,
      };
      return content;
    }
    else
    {
      return null;
    }
  }
}

settings.initialize().then( () =>
{
  if( settings.get( SettingKey.ControllersEnabled.Spotify ) )
  {
    let controller = new SpotifyController();
    controller.startPolling();
  }
} );

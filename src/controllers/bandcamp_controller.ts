import { MediaController, createSingleMediaListener } from 'controllers/media_controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

class BandcampController extends MediaController
{
  constructor( audio: HTMLAudioElement )
  {
    super( Sites.Bandcamp, audio );

    this.color = settings.get( SettingKey.ControllerColors.Bandcamp );
    this.hostname = 'bandcamp.com';

    this.initialize();
  }

  protected previous()
  {
    select( '.prevbutton' ).click();
  }

  protected next()
  {
    select( '.nextbutton' ).click();
  }

  protected getContentInfo()
  {
    let track: string | null;
    let artist: string | null;
    let album: string | null;
    let artwork: string | null;
    if( select( 'h2.trackTitle' ).length !== 0 )
    {
      track = select( '.track_info .title' ).text();
      artist = select( '[itemprop=byArtist] > a' ).text();
      album = select( 'h2.trackTitle' ).text();
      artwork = select( '#tralbumArt img' ).attr( 'src' );
    }
    else
    {
      track = select( '.title' ).text();
      artist = select( '.detail-artist > a' ).text();
      album = select( '.detail-album > a' ).text();
      artwork = select( '.detail-art > img' ).attr( 'src' );
    }

    if( track && artist && album )
    {
      let contentInfo: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: track,
        caption: artist,
        subcaption: album,
        image: artwork,
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
  if( settings.get( SettingKey.ControllersEnabled.Bandcamp ) )
  {
    createSingleMediaListener( 'BandCamp', ( media ) =>
    {
      if( media instanceof HTMLAudioElement
        && media.src )
      {
        return new BandcampController( media );
      }

      return null;
    } );
  }
} );

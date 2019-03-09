import { MediaController, createSingleMediaListener } from 'controllers/media_controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

class GooglePlayMusicController extends MediaController
{
  constructor( audio: HTMLAudioElement )
  {
    super( Sites.GooglePlayMusic, audio );

    this.color = settings.get( SettingKey.ControllerColors.GooglePlayMusic );
    this.supportedOperations = {
      ...this.supportedOperations,
      previous: true,
      next: true,
      like: true,
      dislike: true,
    };
  }

  protected playImpl()
  {
    select( '#player-bar-play-pause' ).click();
  }

  protected pauseImpl()
  {
    select( '#player-bar-play-pause' ).click();
  }

  protected previous()
  {
    select( '#player-bar-rewind' ).click();
  }

  protected next()
  {
    select( '#player-bar-forward' ).click();
  }

  protected likeImpl()
  {
    select( '#player .rating-container > paper-icon-button[data-rating="5"]' ).click();
  }

  protected unlikeImpl()
  {
    select( '#player .rating-container > paper-icon-button[data-rating="5"]' ).click();
  }

  protected dislikeImpl()
  {
    select( '#player .rating-container > paper-icon-button[data-rating="1"]' ).click();
  }

  protected onUndislike()
  {
    select( '#player .rating-container > paper-icon-button[data-rating="1"]' ).click();
  }

  protected isLiked()
  {
    return select( '#player .rating-container > paper-icon-button[data-rating="5"] path' ).length === 1;
  }

  protected isDisliked()
  {
    return select( '#player .rating-container > paper-icon-button[data-rating="1"] path' ).length === 1;
  }

  protected getContentInfo()
  {
    let track = select( '#currently-playing-title' ).text();
    let artist = select( '#player-artist' ).text();
    let album = select( '.player-album' ).text();
    let artwork = select( '#playerBarArt' ).attr( 'src' );
    if( track )
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
  if( settings.get( SettingKey.ControllersEnabled.GooglePlayMusic ) )
  {
    createSingleMediaListener( 'Google Play Music', ( media ) =>
    {
      if( media instanceof HTMLAudioElement )
      {
        let audios = document.querySelectorAll( 'audio:not( .offscreen )' );
        if( media === audios[ 0 ] )
        {
          return new GooglePlayMusicController( media );
        }
      }

      return null;
    } );
  }
} );

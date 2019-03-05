import { Controller } from 'controllers/controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';
import { cssUrlToUrl } from 'common/utilities';

class PandoraController extends Controller
{
  private lastAlbum: string | null = null;
  private lastArtwork: string | null = null;

  constructor()
  {
    super( Sites.Pandora );

    this.color = settings.get( SettingKey.ControllerColors.Pandora );
    this.supportedOperations = {
      ...this.supportedOperations,
      next: true,
      previous: true,
      like: true,
      dislike: true,
    };
  }

  protected playImpl()
  {
    select( '.PlayButton' ).click();
  }

  protected pauseImpl()
  {
    select( '.PlayButton' ).click();
  }

  protected next()
  {
    select( '.SkipButton' ).click();
  }

  protected likeImpl()
  {
    select( '.ThumbUpButton' ).click();
  }

  protected unlikeImpl()
  {
    select( '.ThumbUpButton' ).click();
  }

  protected dislikeImpl()
  {
    select( '.ThumbDownButton' ).click();
  }

  protected onUndislike()
  {
    select( '.ThumbDownButton' ).click();
  }

  protected isLiked()
  {
    return select( '.ThumbUpButton' ).hasClass( 'ThumbUpButton--active' );
  }

  protected isDisliked()
  {
    return select( '.ThumbDownButton' ).hasClass( 'ThumbUpButton--active' );
  }

  protected getProgress()
  {
    return select<HTMLAudioElement>( 'audio:last-of-type' )
      .mapSingle( ( audio ) =>
      {
        if( audio.duration > 0 )
        {
          return audio.currentTime / audio.duration;
        }

        return 0;
      }, 0 );
  }

  protected isPaused()
  {
    return select<HTMLAudioElement>( 'audio:last-of-type' )
      .mapSingle( ( element ) => element.paused, true );
  }

  protected getContentInfo()
  {
    let trackLink = select<HTMLAnchorElement>( 'a.nowPlayingTopInfo__current__trackName' );
    let trackItem = trackLink.find( '.Marquee__wrapper__content__child' ).single();
    if( trackItem.length === 0 )
    {
      trackItem = trackLink;
    }
    let track = trackItem.text();
    let artist = select( '.nowPlayingTopInfo__current__artistName' ).text();
    let album = select( '.nowPlayingTopInfo__current__albumName' ).text();
    let link = trackLink.prop( 'href', '' );

    let artwork: string = '';
    let artContainer = select( '.nowPlayingTopInfo__artContainer__art' );
    if( artContainer.length !== 0 )
    {
      artwork = cssUrlToUrl( artContainer.css( 'backgroundImage', '' ) );
    }

    if( album !== this.lastAlbum
      && artwork === this.lastArtwork )
    {
      return null;
    }

    this.lastAlbum = album;
    this.lastArtwork = artwork;

    if( track )
    {
      let contentInfo: ContentInfo = {
        ...super.getBasicContentInfo(),
        title: track.trim(),
        caption: artist.trim(),
        subcaption: album.trim(),
        image: artwork.trim(),
        link: link,
      };
      return contentInfo;
    }
    else
    {
      return null;
    }
  }

  protected openContentLink( contentLink: string )
  {
    console.log( 'openContentLink is not supported.' );
  }
}

settings.initialize().then( () =>
{
  if( settings.get( SettingKey.ControllersEnabled.Pandora ) )
  {
    let controller = new PandoraController();
    controller.startPolling();
  }
} );

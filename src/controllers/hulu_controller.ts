import { MediaController, createMultiMediaListener } from 'controllers/media_controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

class HuluController extends MediaController
{
  constructor( video: HTMLVideoElement )
  {
    super( Sites.Hulu, video );

    this.color = settings.get( SettingKey.ControllerColors.Hulu );

    this.initialize();
  }

  protected playImpl()
  {
    select( '.controls-bar-container .controls__playback-button-paused-icon' ).click();
  }

  protected pauseImpl()
  {
    select( '.controls-bar-container .controls__playback-button-paused-icon' ).click();
  }

  protected next()
  {
    if( this.media.matches( '.video-player.ad-video-player, .video-player.intro-video-player' ) )
    {
      this.media.currentTime = this.media.duration - 0.1;
    }
    else
    {
      select( '.controls-bar-container .up-next__button' ).click();
    }
  }

  protected getContentInfo()
  {
    let title = select( '.metadata-area__second-line' ).text();
    let subtitle = select( '.metadata-area__third-line' ).text();
    let image = select<HTMLImageElement>( 'img.metadata-area__network-logo' )
      .filter( ( img ) => img.style.display !== 'none' )
      .prop( 'src' );

    if( title )
    {
      let contentInfo: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: title,
        caption: subtitle,
        image: image,
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
  if( settings.get( SettingKey.ControllersEnabled.Hulu ) )
  {
    createMultiMediaListener( 'Hulu', ( media ) =>
    {
      if( media instanceof HTMLVideoElement )
      {
        return new HuluController( media );
      }

      return null;
    } );
  }
} );

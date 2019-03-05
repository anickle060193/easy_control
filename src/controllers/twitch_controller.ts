import { MediaController, createSingleMediaListener } from 'controllers/media_controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

class TwitchController extends MediaController
{
  constructor( video: HTMLVideoElement )
  {
    super( Sites.Twitch, video );

    this.color = settings.get( SettingKey.ControllerColors.Twitch );
    this.supportedOperations = {
      ...this.supportedOperations,
    };
  }

  protected playImpl()
  {
    select( 'button.player-button.qa-pause-play-button' ).click();
  }

  protected getContentInfo()
  {
    let title = select( '.video-info__container p, span[data-a-target="stream-title"]' ).index( 0 ).text();
    let streamer = select( '.channel-header__user h5' ).text();
    let artwork = select<HTMLImageElement>( '.channel-header__user-avatar img' ).prop( 'src' );

    if( title && streamer && artwork )
    {
      let contentInfo: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: title,
        caption: streamer,
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
  if( settings.get( SettingKey.ControllersEnabled.Twitch ) )
  {
    createSingleMediaListener( 'Twitch', ( media ) =>
    {
      if( media instanceof HTMLVideoElement )
      {
        if( media.matches( '.player-video > video' ) )
        {
          console.log( 'Found media:', media );
          return new TwitchController( media );
        }
      }

      return null;
    } );
  }
} );

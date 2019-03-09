import { MediaController, createSingleMediaListener } from 'controllers/media_controller';

import { settings, SettingKey, Sites } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

// tslint:disable:member-ordering
class NetflixController extends MediaController
{
  constructor( video: HTMLVideoElement )
  {
    super( Sites.Netflix, video );

    this.color = settings.get( SettingKey.ControllerColors.Netflix );
    this.supportedOperations = {
      ...this.supportedOperations,
      next: true,
    };

    this.allowFullscreen = true;
  }

  public playImpl()
  {
    select( '.button-nfplayerPlay' ).click();
  }

  public pauseImpl()
  {
    select( '.button-nfplayerPause' ).click();
  }

  public next()
  {
    select( '.button-nfplayerNextEpisode' ).click();
  }

  protected setFullscreen( fullscreen: boolean )
  {
    if( fullscreen )
    {
      select( '.button-nfplayerFullscreen' ).click();
    }
    else
    {
      select( '.button-nfplayerWindowed' ).click();
    }
  }

  public getContentInfo()
  {
    if( select( '.WatchNext' ).length > 0 )
    {
      return null;
    }

    let title = select( '.video-title h4' ).text();
    let caption = '';
    let subcaption = '';
    let episodeInfo = select( '.video-title span' );
    if( episodeInfo.length >= 2 )
    {
      caption = select( '.video-title span' ).index( 0 ).text();
      subcaption = select( '.video-title span' ).index( 1 ).text();
    }

    if( title )
    {
      let info: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: title,
        caption: caption,
        subcaption: subcaption,
      };
      return info;
    }
    else
    {
      return null;
    }
  }
}

settings.initialize().then( () =>
{
  if( settings.get( SettingKey.ControllersEnabled.Netflix ) )
  {
    createSingleMediaListener( 'Netflix', ( media ) =>
    {
      if( media instanceof HTMLVideoElement
        && !media.matches( '.mainView video' ) )
      {
        return new NetflixController( media );
      }

      return null;
    } );
  }
} );

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

    let showTitle = select( '.video-title h4' ).text();
    let episodeNumber = select( '.video-title span' ).index( 0 ).text();
    let episodeTitle = select( '.video-title span' ).index( 1 ).text();

    if( showTitle && episodeNumber && episodeTitle )
    {
      let info: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: showTitle,
        caption: episodeTitle,
        subcaption: episodeNumber,
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
      if( media instanceof HTMLVideoElement )
      {
        return new NetflixController( media );
      }

      return null;
    } );
  }
} );

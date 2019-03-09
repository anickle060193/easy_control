import { MediaController, createSingleMediaListener } from 'controllers/media_controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

class YoutubeController extends MediaController
{
  private hasBeenActivated: boolean;

  constructor( video: HTMLVideoElement )
  {
    super( Sites.Youtube, video );

    this.color = settings.get( SettingKey.ControllerColors.Youtube );
    this.supportedOperations = {
      ...this.supportedOperations,
      next: true,
      like: true,
      dislike: true,
    };

    this.allowFullscreen = true;
    this.mediaContainer = document.body;

    this.hasBeenActivated = this.active;
  }

  protected onFocus()
  {
    super.onFocus();

    this.hasBeenActivated = true;
  }

  protected setFullscreen( fullscreen: boolean )
  {
    select( '.ytp-fullscreen-button' ).click();
  }

  protected pauseImpl()
  {
    if( this.hasBeenActivated )
    {
      super.pauseImpl();
    }
  }

  protected next()
  {
    select( '.ytp-next-button' ).click();
  }

  protected isPaused()
  {
    return !this.hasBeenActivated || super.isPaused();
  }

  protected likeImpl()
  {
    select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 0 ).click();
  }

  protected unlikeImpl()
  {
    select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 0 ).click();
  }

  protected dislikeImpl()
  {
    select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 1 ).click();
  }

  protected undislikeImpl()
  {
    select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 1 ).click();
  }

  protected isLiked()
  {
    return select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 0 ).parent().hasClass( 'style-default-active' );
  }

  protected isDisliked()
  {
    return select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 1 ).parent().hasClass( 'style-default-active' );
  }

  protected getContentInfo()
  {
    let videoTitle = select( '#info-contents h1.title' ).text();
    let channel = select( '#owner-name a' ).text();
    let thumbnailImg = select<HTMLImageElement>( '.ytd-video-owner-renderer img' ).prop( 'src' );

    if( videoTitle && thumbnailImg )
    {
      let contentInfo: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: videoTitle,
        caption: channel,
        subcaption: '',
        image: thumbnailImg,
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
  if( settings.get( SettingKey.ControllersEnabled.Youtube ) )
  {
    createSingleMediaListener( 'Youtube', ( media ) =>
    {
      if( media instanceof HTMLVideoElement )
      {
        return new YoutubeController( media );
      }
      return null;
    } );
  }
} );

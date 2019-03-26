import { MediaController, createMultiMediaListener } from 'controllers/media_controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

function isYoutubeChannelPage()
{
  return /^\/(user|channel)\/.*$/.test( window.location.pathname );
}

class YoutubeController extends MediaController
{
  private hasBeenActivated: boolean;

  constructor( video: HTMLVideoElement )
  {
    super( Sites.Youtube, video );

    this.color = settings.get( SettingKey.ControllerColors.Youtube );

    let channelPage = isYoutubeChannelPage();

    this.supportedOperations = {
      ...this.supportedOperations,
      next: !channelPage,
      like: !channelPage,
      dislike: !channelPage,
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
    select( this.media ).parent( '#player' ).find( '.ytp-fullscreen-button' ).click();
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
    if( !isYoutubeChannelPage() )
    {
      select( this.media ).parent( '#player' ).find( '.ytp-next-button' ).click();
    }
  }

  protected isPaused()
  {
    return !this.hasBeenActivated || super.isPaused();
  }

  protected likeImpl()
  {
    if( !isYoutubeChannelPage() )
    {
      select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 0 ).click();
    }
  }

  protected unlikeImpl()
  {
    if( !isYoutubeChannelPage() )
    {
      select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 0 ).click();
    }
  }

  protected dislikeImpl()
  {
    if( !isYoutubeChannelPage() )
    {
      select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 1 ).click();
    }
  }

  protected undislikeImpl()
  {
    if( !isYoutubeChannelPage() )
    {
      select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 1 ).click();
    }
  }

  protected isLiked()
  {
    if( isYoutubeChannelPage() )
    {
      return false;
    }
    else
    {
      return select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 0 ).parent().hasClass( 'style-default-active' );
    }
  }

  protected isDisliked()
  {
    if( isYoutubeChannelPage() )
    {
      return false;
    }
    else
    {
      return select( '.ytd-video-primary-info-renderer #top-level-buttons button' ).index( 1 ).parent().hasClass( 'style-default-active' );
    }
  }

  protected getContentInfo()
  {
    let videoTitle: string | null = null;
    let channel: string | null = null;
    let thumbnailImg: string | null = null;
    if( isYoutubeChannelPage() )
    {
      videoTitle = select( 'ytd-channel-video-player-renderer #title' ).text();
      channel = select( '#channel-header-container #channel-title' ).text();
      thumbnailImg = select<HTMLImageElement>( '#channel-header-container #avatar img' ).prop( 'src' );
    }
    else
    {
      videoTitle = select( '#info-contents h1.title' ).text();
      channel = select( '#owner-name a' ).text();
      thumbnailImg = select<HTMLImageElement>( '.ytd-video-owner-renderer img' ).prop( 'src' );
    }

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
    createMultiMediaListener( 'Youtube', ( media ) =>
    {
      if( media instanceof HTMLVideoElement )
      {
        return new YoutubeController( media );
      }
      return null;
    } );
  }
} );

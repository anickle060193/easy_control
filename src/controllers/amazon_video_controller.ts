import { MediaController, createSingleMediaListener } from 'controllers/media_controller';

import { Sites, settings, SettingKey } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';
import { cssUrlToUrl } from 'common/utilities';

class AmazonVideoController extends MediaController
{
  constructor( video: HTMLVideoElement )
  {
    super( Sites.AmazonVideo, video );

    this.color = settings.get( SettingKey.ControllerColors.AmazonVideo );
    this.supportedOperations = {
      ...this.supportedOperations,
    };

    this.hostname = null;

    this.mediaContainer = document.querySelector( '.cascadesContainer' );
  }

  protected setFullscreen( fullscreen: boolean )
  {
    if( fullscreen )
    {
      select( '.fullscreenButton:not( .toggled )' ).click();
    }
    else
    {
      select( '.fullscreenButton.toggled' ).click();
    }
  }

  protected getContentInfo()
  {
    let title = select( '.contentTitlePanel .title' ).text();
    let subtitle = select( '.contentTitlePanel .subtitle' ).text();
    let thumbnail = select( '.av-bgimg__div' ).last().css( 'backgroundImage', '' );
    thumbnail = cssUrlToUrl( thumbnail );

    if( title )
    {
      let contentInfo: ContentInfo = {
        ...this.getBasicContentInfo(),
        title: title,
        caption: subtitle,
        image: thumbnail,
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
  if( settings.get( SettingKey.ControllersEnabled.AmazonVideo ) )
  {
    createSingleMediaListener( 'Amazon Video', ( media ) =>
    {
      if( media instanceof HTMLVideoElement )
      {
        if( media.style.visibility !== 'hidden' )
        {
          return new AmazonVideoController( media );
        }
      }

      return null;
    } );
  }
} );

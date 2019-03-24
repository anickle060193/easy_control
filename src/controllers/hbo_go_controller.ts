import { MediaController, createSingleMediaListener } from 'controllers/media_controller';

import { settings, SettingKey, Sites } from 'common/settings';
import { ContentInfo } from 'common/content';
import { cssUrlToUrl } from 'common/utilities';
import { selectXPath } from 'common/selector';

class HboGoController extends MediaController
{
  constructor( video: HTMLVideoElement )
  {
    super( Sites.HboGo, video );

    this.color = settings.get( SettingKey.ControllerColors.HboGo );
    this.supportedOperations = {
      ...this.supportedOperations,
    };

    this.allowFullscreen = true;
    this.mediaContainer = video.parentElement;
  }

  protected getContentInfo()
  {
    let title: string | null = null;
    let subtitle: string | null = null;

    let elem: HTMLElement | null = this.media;
    while( elem instanceof HTMLElement )
    {
      let sibling = elem.nextElementSibling;
      if( sibling )
      {
        let seasonNameElem = sibling.querySelector( 'a > div.default > span' );
        if( seasonNameElem )
        {
          let seasonName = seasonNameElem.textContent;
          if( seasonName )
          {
            let episodeTitleElem = sibling.querySelector( 'a + div.default > span' );
            if( episodeTitleElem )
            {
              let episodeTitle = episodeTitleElem.textContent;
              if( episodeTitle )
              {
                title = episodeTitle;
                subtitle = seasonName;
                break;
              }
            }
          }
        }

        let span = sibling.querySelector( 'div.default > span' );
        if( span )
        {
          let text = span.textContent;
          if( text )
          {
            title = text;
            break;
          }
        }
      }

      elem = elem.parentElement;
    }

    let thumbnail = cssUrlToUrl( selectXPath( '//div[contains( @style, "blob:https://play.hbogo.com/" )]' ).css( 'backgroundImage', '' ) );

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
  if( settings.get( SettingKey.ControllersEnabled.HboGo ) )
  {
    createSingleMediaListener( 'HBO Go', ( media ) =>
    {
      if( media instanceof HTMLVideoElement )
      {
        return new HboGoController( media );
      }

      return null;
    } );
  }
} );

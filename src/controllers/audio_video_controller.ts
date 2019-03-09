import { MediaController, createMultiMediaListener } from 'controllers/media_controller';

import { Sites, SettingKey, settings } from 'common/settings';
import { select } from 'common/selector';
import { ContentInfo } from 'common/content';

class AudioVideoController extends MediaController
{
  constructor( media: HTMLAudioElement | HTMLVideoElement, color: string | null )
  {
    super( Sites.GenericAudioVideo, media );

    this.color = color || settings.get( SettingKey.ControllerColors.GenericAudioVideo );
    this.supportedOperations = {
      ...this.supportedOperations,
    };

    this.hostname = null;
  }

  protected getContentInfo()
  {
    let contentInfo: ContentInfo = {
      ...this.getBasicContentInfo(),
      title: window.location.host,
      image: null,
    };
    return contentInfo;
  }

  protected openContentLink( contentLink: string )
  {
    console.log( 'openContentLink is not supported' );
  }
}

function sourceMatchesBlacklist( source: string, blacklist: string[] )
{
  for( let blackListSite of blacklist )
  {
    if( blackListSite && source.includes( blackListSite ) )
    {
      return true;
    }
  }
  return false;
}

settings.initialize().then( () =>
{
  if( settings.get( SettingKey.ControllersEnabled.GenericAudioVideo ) )
  {
    let color: string | null = null;

    let metaThemeColor = select( 'meta[name="theme-color"][content]:not( [content=""] )' ).index( 0 );
    color = metaThemeColor.attr( 'content' );

    if( !color )
    {
      let metaTileColor = select( 'meta[name="msapplication-TileColor"][content]:not( [content=""] )' ).index( 0 );
      color = metaTileColor.attr( 'content' );
    }

    let url = window.location.href;
    if( sourceMatchesBlacklist( url, settings.get( SettingKey.Other.SiteBlacklist ) ) )
    {
      console.log( 'Easy Control - Blacklisted site:', url );
      return;
    }

    createMultiMediaListener( 'Generic Audio/Video', ( media ) =>
    {
      let src = media.currentSrc;
      if( src )
      {
        if( sourceMatchesBlacklist( src, settings.get( SettingKey.Other.SiteBlacklist ) ) )
        {
          console.log( 'Easy Control - Blacklisted source:', src );
          return null;
        }
      }

      return new AudioVideoController( media, color );
    } );
  }
} );

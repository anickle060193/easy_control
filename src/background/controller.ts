import { updateControlsPopup } from 'background/controlsPopup';

import { MessageTypes, createBasicMessage, createOpenContentLinkMessage, SupportedOperations, StatusData } from 'common/message';
import { ContentInfo } from 'common/content';
import { Sites } from 'common/settings';

export class BackgroundController
{
  public readonly port: chrome.runtime.Port;
  public readonly name: Sites;

  public color: string;
  public allowPauseOnInactivity: boolean;
  public supportedOperations: SupportedOperations;
  public hostname: string | null;

  public paused: boolean;
  public progress: number;
  public active: boolean;
  public isLiked: boolean;
  public isDisliked: boolean;
  public content: ContentInfo | null;

  public get tabId(): number | null
  {
    if( this.port.sender && this.port.sender.tab && this.port.sender.tab && this.port.sender.tab.id )
    {
      return this.port.sender.tab.id;
    }
    return null;
  }

  constructor( port: chrome.runtime.Port )
  {
    if( !( port.name in Sites ) )
    {
      throw new Error( 'Unknown controller name: ' + port.name );
    }

    this.port = port;
    this.name = this.port.name as Sites;
    this.color = '';
    this.allowPauseOnInactivity = true;
    this.supportedOperations = {};
    this.hostname = null;

    this.paused = true;
    this.progress = 0.0;
    this.active = false;
    this.isLiked = false;
    this.isDisliked = false;

    this.content = null;
  }

  public updateControlsPopup()
  {
    updateControlsPopup( {
      color: this.color,
      supportedOperations: this.supportedOperations,
      status: {
        active: this.active,
        paused: this.paused,
        progress: this.progress,
        isLiked: this.isLiked,
        isDisliked: this.isDisliked,
      },
      content: this.content,
    } );
  }

  public onStatus( status: StatusData )
  {
    this.active = status.active;
    this.paused = status.paused;
    this.progress = status.progress;
    this.isLiked = status.isLiked;
    this.isDisliked = status.isDisliked;
  }

  public play()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Play ) );
  }

  public pause()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Pause ) );
  }

  public next()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Next ) );
  }

  public previous()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Previous ) );
  }

  public skipBackward()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.SkipBackward ) );
  }

  public skipForward()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.SkipForward ) );
  }

  public like()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Like ) );
  }

  public unlike()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Unlike ) );
  }

  public dislike()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Dislike ) );
  }

  public undislike()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.Undislike ) );
  }

  public volumeUp()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.VolumeUp ) );
  }

  public volumeDown()
  {
    this.port.postMessage( createBasicMessage( MessageTypes.FromBackground.VolumeDown ) );
  }

  public openContentLink( contentLink: string )
  {
    this.port.postMessage( createOpenContentLinkMessage( contentLink ) );
  }
}

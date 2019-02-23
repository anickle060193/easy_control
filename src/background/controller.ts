import { MessageTypes, fromBackgroundMessage, openContentLinkMessage } from 'common/message';
import { ContentInfo } from 'common/content';
import { Sites } from 'common/settings';

export class BackgroundController
{
  public readonly port: chrome.runtime.Port;
  public readonly name: Sites;

  public color: string;
  public allowPauseOnInactivity: boolean;
  public hostname: string | null;

  public paused: boolean;
  public progress: number;
  public active: boolean;
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
    this.hostname = null;

    this.paused = true;
    this.progress = 0.0;
    this.active = false;
    this.content = null;
  }

  public play()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Play ) );
  }

  public pause()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Pause ) );
  }

  public next()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Next ) );
  }

  public previous()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Previous ) );
  }

  public like()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Like ) );
  }

  public unlike()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Unlike ) );
  }

  public dislike()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Dislike ) );
  }

  public undislike()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Undislike ) );
  }

  public volumeUp()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.VolumeUp ) );
  }

  public volumeDown()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.VolumeDown ) );
  }

  public openContentLink( contentLink: string )
  {
    this.port.postMessage( openContentLinkMessage( contentLink ) );
  }
}

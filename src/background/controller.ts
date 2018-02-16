import { MessageTypes, fromBackgroundMessage, openContentMessage } from '../common/message';
import { ContentInfo } from '../common/content';

export class BackgroundController
{
  port: chrome.runtime.Port;
  name: string;
  color: string;
  allowPauseOnInactivity: boolean;
  hostname: string | null;
  paused: boolean;
  progress: number;
  active: boolean;
  content: ContentInfo | null;

  constructor( port: chrome.runtime.Port )
  {
    this.port = port;
    this.name = this.port.name;
    this.color = '';
    this.allowPauseOnInactivity = true;
    this.hostname = null;

    this.paused = true;
    this.progress = 0.0;
    this.active = false;
    this.content = null;
  }

  play()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Play ) );
  }

  pause()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Pause ) );
  }

  next()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Next ) );
  }

  previous()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Previous ) );
  }

  like()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Like ) );
  }

  unlike()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Unlike ) );
  }

  dislike()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Dislike ) );
  }

  undislike()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.Undislike ) );
  }

  volumeUp()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.VolumeUp ) );
  }

  volumeDown()
  {
    this.port.postMessage( fromBackgroundMessage( MessageTypes.FromBackground.VolumeDown ) );
  }

  openContent( content: string )
  {
    this.port.postMessage( openContentMessage( content ) );
  }
}

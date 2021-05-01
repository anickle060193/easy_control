import { BackgroundMessage, BackgroundMessageId } from '../common/background_messages';
import { ContentMessage, ContentMessageId } from '../common/content_messages';
import { ControllerId, ControllerMedia, ControllerStatus } from '../common/controllers';
import { EventEmitter } from '../common/EventEmitter';

let controllerCount = 0;

export class BackgroundController
{
  public readonly id: ControllerId;
  public readonly name: string;
  public status: Readonly<ControllerStatus>;
  public media: Readonly<ControllerMedia>;

  public readonly onPlayed = new EventEmitter();
  public readonly onPaused = new EventEmitter();
  public readonly onProgressChanged = new EventEmitter();
  public readonly onMediaChanged = new EventEmitter();
  public readonly onDisconnected = new EventEmitter();

  constructor(
    private readonly port: chrome.runtime.Port
  )
  {
    this.id = port.name as ControllerId;
    this.name = `${this.id}-${++controllerCount}`;

    this.status = {
      playing: false,
      progress: 0,
    };

    this.media = {
      track: null,
      artist: null,
      album: null,
      artwork: null,
    };

    this.port.onMessage.addListener( this.onMessage );
    this.port.onDisconnect.addListener( this.onDisconnect );
  }

  private onDisconnect = (): void =>
  {
    this.onDisconnected.dispatch();
  }

  private onMessage = ( message: ContentMessage ): void =>
  {
    if( message.id === ContentMessageId.Update )
    {
      const previousStatus = this.status;
      this.status = message.status;

      const previousMedia = this.media;
      this.media = message.media;

      if( !previousStatus.playing && this.status.playing )
      {
        this.onPlayed.dispatch();
      }
      else if( previousStatus.playing && !this.status.playing )
      {
        this.onPaused.dispatch();
      }

      if( previousStatus.progress !== this.status.progress )
      {
        this.onProgressChanged.dispatch();
      }

      if( previousMedia.track !== this.media.track )
      {
        this.onMediaChanged.dispatch();
      }
    }
    else
    {
      console.warn( 'Unknown message:', message );
    }
  }

  public sendMessage( messageId: BackgroundMessageId ): void
  {
    const message: BackgroundMessage = {
      id: messageId,
    };
    this.port.postMessage( message );
  }
}

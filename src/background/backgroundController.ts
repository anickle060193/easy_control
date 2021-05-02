import { BackgroundMessage, BackgroundMessageId } from '../common/backgroundMessages';
import { ContentMessage, ContentMessageId } from '../common/contentMessages';
import { ControllerId, ControllerMedia, ControllerStatus } from '../common/controllers';
import { EventEmitter } from '../common/EventEmitter';

let controllerCount = 0;

export class BackgroundController
{
  public readonly controllerId: ControllerId;
  public readonly id: string;
  public status: Readonly<ControllerStatus>;
  public previousMediaChangedIndication: string | null;
  public media: Readonly<ControllerMedia>;

  public readonly onPlayed = new EventEmitter();
  public readonly onPaused = new EventEmitter();
  public readonly onProgressChanged = new EventEmitter();
  public readonly onMediaChanged = new EventEmitter();
  public readonly onDisconnected = new EventEmitter();

  public lastOnPlayedTime = 0;
  public mediaChangedHandled = false;

  public get tabId(): number | undefined
  {
    return this.port.sender?.tab?.id;
  }

  constructor(
    private readonly port: chrome.runtime.Port
  )
  {
    this.controllerId = port.name as ControllerId;
    this.id = `${this.controllerId}-${++controllerCount}`;

    this.status = {
      enabled: false,
      playing: false,
      progress: 0,
    };

    this.previousMediaChangedIndication = null;

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
      this.media = message.media;

      if( !previousStatus.playing && this.status.playing )
      {
        this.lastOnPlayedTime = Date.now();
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

      if( this.status.playing )
      {
        if( !this.mediaChangedHandled
          || ( typeof message.mediaChangedIndication === 'string'
            && message.mediaChangedIndication !== this.previousMediaChangedIndication ) )
        {
          this.previousMediaChangedIndication = message.mediaChangedIndication;
          this.mediaChangedHandled = false;

          this.onMediaChanged.dispatch();
        }
      }
    }
    else
    {
      console.warn( 'Unknown message:', message );
    }
  }

  public async isActiveTab(): Promise<boolean>
  {
    const tabId = this.port.sender?.tab?.id;
    if( typeof tabId !== 'number' )
    {
      console.warn( 'Controller port has no tab ID:', this.id, this.port );
      return false;
    }

    return new Promise<boolean>( ( resolve ) =>
    {
      chrome.tabs.get( tabId, ( tab ) =>
      {
        if( chrome.runtime.lastError )
        {
          console.error( 'Failed to retrieve controller tab:', this, chrome.runtime.lastError );
          resolve( false );
          return;
        }

        if( !tab.active )
        {
          resolve( false );
          return;
        }

        chrome.windows.get( tab.windowId, ( window ) =>
        {
          if( chrome.runtime.lastError )
          {
            console.error( 'Failed to retrieve controller tab window:', this, tab, chrome.runtime.lastError );
            resolve( false );
            return;
          }

          resolve( window.focused );
        } );
      } );
    } );
  }

  public sendMessage( messageId: BackgroundMessageId ): void
  {
    const message: BackgroundMessage = {
      id: messageId,
    };
    this.port.postMessage( message );
  }
}

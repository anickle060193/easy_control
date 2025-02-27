import { BackgroundMessage, BackgroundMessageId } from '../common/backgroundMessages';
import { ContentMessage, ContentMessageId } from '../common/contentMessages';
import { ControllerCapabilities, ControllerCommand, ControllerId, ControllerMedia, ControllerStatus, DEFAULT_CONTROLLER_CAPABILITIES, DEFAULT_CONTROLLER_MEDIA, DEFAULT_CONTROLLER_STATUS } from '../common/controllers';
import { EventEmitter } from '../common/EventEmitter';

let controllerCount = 0;

export class BackgroundController
{
  public readonly controllerId: ControllerId;
  public readonly id: string;
  public status: Readonly<ControllerStatus>;
  public previousMediaChangedIndication: string | null;
  public media: Readonly<ControllerMedia>;
  public capabilities: Readonly<ControllerCapabilities>;

  public readonly onPlayed = new EventEmitter();
  public readonly onPaused = new EventEmitter();
  public readonly onProgressChanged = new EventEmitter();
  public readonly onMediaChanged = new EventEmitter();
  public readonly onDisconnected = new EventEmitter();

  public mediaChangedHandled = false;

  public get tabId(): number | undefined
  {
    return this.port.sender?.tab?.id;
  }

  constructor(
    private readonly port: browser.Runtime.Port
  )
  {
    this.controllerId = port.name as ControllerId;
    this.id = `${this.controllerId}-${++controllerCount}`;

    this.status = DEFAULT_CONTROLLER_STATUS;
    this.previousMediaChangedIndication = null;
    this.media = DEFAULT_CONTROLLER_MEDIA;
    this.capabilities = DEFAULT_CONTROLLER_CAPABILITIES;

    this.port.onMessage.addListener( this.onMessage );
    this.port.onDisconnect.addListener( this.onDisconnect );
  }

  private onDisconnect = (): void =>
  {
    this.onDisconnected.dispatch();
  };

  private onMessage = ( message: ContentMessage ): void =>
  {
    if( message.id === ContentMessageId.Update )
    {
      const previousStatus = this.status;
      this.status = message.status;
      this.media = message.media;
      this.capabilities = message.capabilities;

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
  };

  public async isActiveTab(): Promise<boolean>
  {
    const tabId = this.port.sender?.tab?.id;
    if( typeof tabId !== 'number' )
    {
      console.warn( 'Controller port has no tab ID:', this.id, this.port );
      return false;
    }

    try
    {
      const tab = await browser.tabs.get( tabId );
      if( !tab.active
        || typeof tab.windowId !== 'number' )
      {
        return false;
      }

      const window = await browser.windows.get( tab.windowId );
      return window.focused;
    }
    catch( e )
    {
      console.error( 'Failed to retrieve controller tab/window:', this, e );
      return false;
    }
  }

  public sendMessage( message: BackgroundMessage ): void
  {
    this.port.postMessage( message );
  }

  public sendCommand( command: ControllerCommand ): void
  {
    this.sendMessage( {
      id: BackgroundMessageId.Command,
      command,
    } );
  }
}

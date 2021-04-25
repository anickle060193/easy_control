import { BackgroundMessage, BackgroundMessageId } from '../common/background_messages';
import { ControllerId, MediaInfo } from '../common/controllers';

let controllerCount = 0;

export class BackgroundController
{
  public readonly id: ControllerId;
  public readonly name: string;
  public mediaInfo: MediaInfo;

  constructor(
    public readonly port: chrome.runtime.Port
  )
  {
    this.id = port.name as ControllerId;
    this.name = `${this.id}-${++controllerCount}`;
    this.mediaInfo = {
      playing: false,
      track: null,
      artist: null,
      album: null,
      artwork: null,
      progress: 0,
    };
  }

  public sendMessage( messageId: BackgroundMessageId ): void
  {
    const message: BackgroundMessage = {
      id: messageId,
    };
    this.port.postMessage( message );
  }
}

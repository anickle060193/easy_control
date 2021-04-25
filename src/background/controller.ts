import { BackgroundMessage, BackgroundMessageId } from '../common/background_messages';
import { MediaInfo } from '../common/controllers';

let controllerCount = 0;

export class BackgroundController
{
  public readonly name: string;
  public mediaInfo: MediaInfo;

  constructor(
    public readonly port: chrome.runtime.Port
  )
  {
    this.name = `${port.name}-${++controllerCount}`;
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

import { ContentInfo } from 'common/content';
import { initializeMessage, Message, MessageTypes, statusMessage, newContentMessage } from 'common/message';
import { Sites } from 'common/settings';

// tslint:disable:member-ordering
export abstract class Controller
{
  public readonly name: string;
  public color: string;
  public hostname: string;
  public allowPauseOnInactivity: boolean;

  public initialized: boolean;

  public active: boolean;

  public disconnected: boolean;
  public currentContent: ContentInfo | null;
  public lastProgress: number;
  public pollingInterval: number;
  public port: chrome.runtime.Port;

  constructor( name: Sites )
  {
    this.name = name;
    this.color = 'black';
    this.hostname = window.location.hostname;
    this.allowPauseOnInactivity = true;

    this.initialized = false;

    this.active = !document.hidden;
    console.log( 'Initial active:', this.active );
    console.log( 'Initial visibility state:', document.visibilityState );

    this.disconnected = false;
    this.currentContent = null;
    this.lastProgress = 0.0;
    this.pollingInterval = 0;
    this.port = chrome.runtime.connect( null!, { name: name } );

    this.port.onMessage.addListener( this.onPortMessage );
    this.port.onDisconnect.addListener( this.onPortDisconnect );

    window.addEventListener( 'focus', this.onFocus );
    window.addEventListener( 'blur', this.onBlur );
  }

  private onFocus = () =>
  {
    this.active = true;
  }

  private onBlur = () =>
  {
    this.active = false;
  }

  protected initialize()
  {
    let data = {
      color: this.color,
      allowPauseOnInactivity: this.allowPauseOnInactivity,
      hostname: this.hostname
    };
    this.port.postMessage( initializeMessage( data ) );

    this.initialized = true;
  }

  private onPortMessage = ( message: Message ) =>
  {
    if( message.type === MessageTypes.FromBackground.Pause )
    {
      console.log( 'Recieved: PAUSE' );
      this.pause();
    }
    else if( message.type === MessageTypes.FromBackground.Play )
    {
      console.log( 'Recieved: PLAY' );
      this.play();
    }
    else if( message.type === MessageTypes.FromBackground.Next )
    {
      console.log( 'Recieved: NEXT' );
      this.next();
    }
    else if( message.type === MessageTypes.FromBackground.Previous )
    {
      console.log( 'Recieved: PREVIOUS' );
      this.previous();
    }
    else if( message.type === MessageTypes.FromBackground.Dislike )
    {
      console.log( 'Recieved: DISLIKE' );
      this.dislike();
    }
    else if( message.type === MessageTypes.FromBackground.Undislike )
    {
      console.log( 'Recieved: UNDISLIKE' );
      this.undislike();
    }
    else if( message.type === MessageTypes.FromBackground.Like )
    {
      console.log( 'Recieved: LIKE' );
      this.like();
    }
    else if( message.type === MessageTypes.FromBackground.Unlike )
    {
      console.log( 'Recieved: UNLIKE' );
      this.unlike();
    }
    else if( message.type === MessageTypes.FromBackground.VolumeUp )
    {
      console.log( 'Recieved: VOLUME UP' );
      this.volumeUp();
    }
    else if( message.type === MessageTypes.FromBackground.VolumeDown )
    {
      console.log( 'Recieved: VOLUME DOWN' );
      this.volumeDown();
    }
    else if( message.type === MessageTypes.FromBackground.OpenContentLink )
    {
      console.log( 'Recieved: OPEN CONTENT' );
      this.openContentLink( message.data );
    }
    else
    {
      console.warn( 'Unknown controller message:', message );
    }
  }

  private reportStatus()
  {
    let data = {
      paused: this.isPaused(),
      progress: this.getProgress(),
      active: this.active
    };
    this.port.postMessage( statusMessage( data ) );
  }

  private onPoll = () =>
  {
    this.reportStatus();

    if( !this.isPaused() )
    {
      let currentProgress = this.getProgress();

      let contentInfo = this.getContentInfo();
      if( contentInfo !== null )
      {
        let isNewContent = false;
        if( this.currentContent === null )
        {
          isNewContent = true;
          console.log( 'New Content - Current is null' );
        }
        else if( this.currentContent.title !== contentInfo.title )
        {
          isNewContent = true;
          console.log( 'New Content - Title\'s don\'t match' );
        }
        else if( this.lastProgress >= 0.95 && currentProgress < 0.05 && currentProgress > 0 )
        {
          isNewContent = true;
          console.log( 'New Content - Progress went from ' + this.lastProgress + ' to ' + currentProgress );
        }

        if( isNewContent )
        {
          console.log( contentInfo );
          this.currentContent = contentInfo;
          this.port.postMessage( newContentMessage( this.currentContent ) );
        }
      }

      this.lastProgress = currentProgress;
    }
  }

  public startPolling()
  {
    console.log( 'Controller - Start polling' );

    if( !this.initialized )
    {
      throw new Error( 'Must initialize controller before polling.' );
    }

    this.pollingInterval = window.setInterval( this.onPoll, 50 );
  }

  public stopPolling()
  {
    console.log( 'Controller - Stop polling' );
    window.clearInterval( this.pollingInterval );
  }

  protected onPortDisconnect = () =>
  {
    console.log( 'Disconnect' );
    this.disconnected = true;

    window.removeEventListener( 'focus', this.onFocus );
    window.removeEventListener( 'blur', this.onBlur );

    this.stopPolling();
    this.port.disconnect();
  }

  protected onPlay()
  {
    console.log( 'play not supported.' );
  }

  protected play()
  {
    if( this.isPaused() )
    {
      this.onPlay();
    }
  }

  protected onPause()
  {
    console.log( 'pause not supported.' );
  }

  protected pause()
  {
    if( !this.isPaused() )
    {
      this.onPause();
    }
  }

  protected previous()
  {
    console.log( 'previous is not supported' );
  }

  protected next()
  {
    console.log( 'next is not supported' );
  }

  protected onLike()
  {
    console.log( 'like not supported.' );
  }

  protected like()
  {
    if( !this.isLiked() )
    {
      this.onLike();
    }
  }

  protected onUnlike()
  {
    console.log( 'unlike not supported.' );
  }

  protected unlike()
  {
    if( this.isLiked() )
    {
      this.onUnlike();
    }
  }

  protected onDislike()
  {
    console.log( 'dislike not supported.' );
  }

  protected dislike()
  {
    if( !this.isDisliked() )
    {
      this.onDislike();
    }
  }

  protected onUnDislike()
  {
    console.log( 'undislike not supported.' );
  }

  protected undislike()
  {
    if( this.isDisliked() )
    {
      this.onUnDislike();
    }
  }

  protected isLiked(): boolean
  {
    return false;
  }

  protected isDisliked(): boolean
  {
    return false;
  }

  protected isPaused(): boolean
  {
    return false;
  }

  protected getProgress(): number
  {
    return 0.0;
  }

  protected getBasicContentInfo()
  {
    return {
      link: location.href,
      isLiked: this.isLiked(),
      isDisliked: this.isDisliked()
    };
  }

  protected getContentInfo(): ContentInfo | null
  {
    return null;
  }

  protected volumeUp()
  {
    console.log( 'volumeUp is not supported' );
  }

  protected volumeDown()
  {
    console.log( 'volumeDown is not supported' );
  }

  protected openContentLink( contentLink: string )
  {
    window.location.href = contentLink;
  }
}

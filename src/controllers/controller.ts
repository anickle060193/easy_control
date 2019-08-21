import { ContentInfo } from 'common/content';
import { createControllerInitializeMessage, Message, MessageTypes, createStatusMessage, createNewContentMessage, SupportedOperations } from 'common/message';
import { Sites } from 'common/settings';
import showSnackbar from 'common/components/snackbar';

// tslint:disable:member-ordering
export abstract class Controller
{
  protected readonly name: string;
  protected hostname: string | null;
  protected allowPauseOnInactivity: boolean;

  protected active: boolean;

  protected disconnected: boolean;
  protected currentContent: ContentInfo | null;
  protected lastProgress: number;
  protected pollingInterval: number;
  protected port: chrome.runtime.Port;

  protected color: string;
  protected supportedOperations: SupportedOperations;

  constructor( name: Sites )
  {
    this.name = name;
    this.color = 'black';
    this.supportedOperations = {
      playPause: true,
    };
    this.hostname = window.location.hostname;
    this.allowPauseOnInactivity = true;

    this.active = !document.hidden;
    console.log( name, '- Active:', this.active, '- Visible:', document.visibilityState );

    this.disconnected = false;
    this.currentContent = null;
    this.lastProgress = 0.0;
    this.pollingInterval = 0;
    this.port = chrome.runtime.connect( null!, { name: name } );

    this.port.onMessage.addListener( ( message ) => this.onPortMessage( message ) );
    this.port.onDisconnect.addListener( () => this.onPortDisconnect() );

    window.addEventListener( 'focus', this.onFocusScope );
    window.addEventListener( 'blur', this.onBlurScope );
  }

  private onFocusScope = () =>
  {
    this.onFocus();
  }

  protected onFocus()
  {
    this.active = true;
  }

  private onBlurScope = () =>
  {
    this.onBlur();
  }

  protected onBlur()
  {
    this.active = false;
  }

  private initialize()
  {
    this.port.postMessage( createControllerInitializeMessage( {
      color: this.color,
      allowPauseOnInactivity: this.allowPauseOnInactivity,
      hostname: this.hostname,
      supportedOperations: this.supportedOperations,
    } ) );
  }

  private onPortMessage( message: Message )
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
    else if( message.type === MessageTypes.FromBackground.SkipBackward )
    {
      console.log( 'Recieved: SKIP BACKWARD' );
      this.skipBackward();
    }
    else if( message.type === MessageTypes.FromBackground.SkipForward )
    {
      console.log( 'Recieved: SKIP FORWARD' );
      this.skipForward();
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
    this.port.postMessage( createStatusMessage( {
      paused: this.isPaused(),
      progress: this.getProgress(),
      active: this.active,
      isLiked: this.isLiked(),
      isDisliked: this.isDisliked(),
    } ) );
  }

  protected onPoll = () =>
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
          this.port.postMessage( createNewContentMessage( this.currentContent ) );
        }
      }

      this.lastProgress = currentProgress;
    }
  }

  public startPolling()
  {
    this.initialize();

    this.onStartPolling();
  }

  protected onStartPolling()
  {
    console.log( 'Controller - Start polling' );
    this.pollingInterval = window.setInterval( this.onPoll, 100 );
  }

  public stopPolling()
  {
    this.onStopPolling();
  }

  protected onStopPolling()
  {
    console.log( 'Controller - Stop polling' );
    window.clearInterval( this.pollingInterval );
  }

  protected onPortDisconnect()
  {
    this.disconnected = true;

    window.removeEventListener( 'focus', this.onFocus );
    window.removeEventListener( 'blur', this.onBlur );

    this.stopPolling();
    this.port.disconnect();
  }

  protected abstract playImpl(): void;

  protected play()
  {
    if( this.isPaused() )
    {
      this.playImpl();
    }
  }

  protected abstract pauseImpl(): void;

  protected pause()
  {
    if( !this.isPaused() )
    {
      this.pauseImpl();
    }
  }

  protected previous()
  {
    showSnackbar( 'Previous is not supported for this controller.' );
  }

  protected next()
  {
    showSnackbar( 'Next is not supported for this controller.' );
  }

  protected skipBackward()
  {
    showSnackbar( 'Skip backward is not supported for this controller.' );
  }

  protected skipForward()
  {
    showSnackbar( 'Skip forward is not supported for this controller.' );
  }

  protected likeImpl()
  {
    showSnackbar( 'Like is not supported for this controller.' );
  }

  protected like()
  {
    if( !this.isLiked() )
    {
      this.likeImpl();
    }
  }

  protected unlikeImpl()
  {
    showSnackbar( 'Unlike is not supported for this controller.' );
  }

  protected unlike()
  {
    if( this.isLiked() )
    {
      this.unlikeImpl();
    }
  }

  protected dislikeImpl()
  {
    showSnackbar( 'Dislike is not supported for this controller.' );
  }

  protected dislike()
  {
    if( !this.isDisliked() )
    {
      this.dislikeImpl();
    }
  }

  protected undislikeImpl()
  {
    showSnackbar( 'Undislike is not supported for this controller.' );
  }

  protected undislike()
  {
    if( this.isDisliked() )
    {
      this.undislikeImpl();
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

  protected abstract isPaused(): boolean;

  protected abstract getProgress(): number;

  protected getBasicContentInfo()
  {
    return {
      link: location.href,
    };
  }

  protected getContentInfo(): ContentInfo | null
  {
    return null;
  }

  protected volumeUp()
  {
    showSnackbar( 'Volume-up is not supported for this controller.' );
  }

  protected volumeDown()
  {
    showSnackbar( 'Volume-down is not supported for this controller.' );
  }

  protected openContentLink( contentLink: string )
  {
    window.location.href = contentLink;
  }
}

import { ContentInfo } from "../common/content";
import { initializeMessage, Message, MessageTypes, statusMessage, newContentMessage } from "../common/message";
import { SettingsType } from "../common/settings";

export class Controller
{
  static settings: Partial<SettingsType> = {};

  name: string;
  color: string;
  hostname: string;
  allowPauseOnInactivity: boolean;

  initialized: boolean;

  active: boolean;

  disconnected: boolean;
  currentContent: ContentInfo | null;
  lastProgress: number;
  pollingInterval: number;
  port: chrome.runtime.Port;

  constructor( name: string )
  {
    this.name = name;
    this.color = 'black';
    this.hostname = window.location.hostname;
    this.allowPauseOnInactivity = true;

    this.initialized = false;

    this.active = !document.hidden;
    console.log( 'Initial active: ' + this.active );
    console.log( 'Initial visibility state: ' + document.visibilityState );

    this.disconnected = false;
    this.currentContent = null;
    this.lastProgress = 0.0;
    this.pollingInterval = 0;
    this.port = chrome.runtime.connect( null!, { name: name } );

    this.port.onMessage.addListener( this.handleMessage.bind( this ) );
    this.port.onDisconnect.addListener( this.disconnect.bind( this ) );

    $( window ).focus( $.proxy( this.activate, this ) );
    $( window ).blur( $.proxy( this.deactivate, this ) );
  }

  initialize()
  {
    let data = {
      color: this.color,
      allowPauseOnInactivity: this.allowPauseOnInactivity,
      hostname: this.hostname
    };
    this.port.postMessage( initializeMessage( data ) );

    this.initialized = true;
  }

  activate()
  {
    this.active = true;
  }

  deactivate()
  {
    this.active = false;
  }

  handleMessage( message: Message )
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
    else if( message.type == MessageTypes.FromBackground.Undislike )
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
  }

  reportStatus()
  {
    let data = {
      paused: this.isPaused(),
      progress: this.getProgress(),
      active: this.active
    };
    this.port.postMessage( statusMessage( data ) );
  }

  poll()
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

  startPolling()
  {
    console.log( 'Controller - Start polling' );

    if( !this.initialized )
    {
      throw 'Must initialize controller before polling.';
    }

    this.pollingInterval = window.setInterval( this.poll.bind( this ), 50 );
  }

  stopPolling()
  {
    console.log( 'Controller - Stop polling' );
    window.clearInterval( this.pollingInterval );
  }

  disconnect()
  {
    console.log( 'Disconnect' );
    this.disconnected = true;
    $( window ).off( 'focus', this.activate );
    $( window ).off( 'blur', this.deactivate );
    this.stopPolling();
    this.port.disconnect();
  }

  _play()
  {
    console.log( 'play not supported.' );
  }

  play()
  {
    if( this.isPaused() )
    {
      this._play();
    }
  }

  _pause()
  {
    console.log( 'pause not supported.' );
  }

  pause()
  {
    if( !this.isPaused() )
    {
      this._pause();
    }
  }

  previous()
  {
    console.log( 'previous is not supported' );
  }

  next()
  {
    console.log( 'next is not supported' );
  }

  _like()
  {
    console.log( 'like not supported.' );
  }

  like()
  {
    if( !this.isLiked() )
    {
      this._like();
    }
  }

  _unlike()
  {
    console.log( 'unlike not supported.' );
  }

  unlike()
  {
    if( this.isLiked() )
    {
      this._unlike();
    }
  }

  _dislike()
  {
    console.log( 'dislike not supported.' );
  }

  dislike()
  {
    if( !this.isDisliked() )
    {
      this._dislike();
    }
  }

  _undislike()
  {
    console.log( 'undislike not supported.' );
  }

  undislike()
  {
    if( this.isDisliked() )
    {
      this._undislike();
    }
  }

  isLiked()
  {
    return false;
  }

  isDisliked()
  {
    return false;
  }

  isPaused()
  {
    return false;
  }

  getProgress()
  {
    return 0.0;
  }

  getContentInfo(): ContentInfo | null
  {
    return {
      title: '',
      caption: '',
      subcaption: '',
      image: '',
      link: location.href,
      isLiked: this.isLiked(),
      isDisliked: this.isDisliked()
    };
  }

  volumeUp()
  {
    console.log( 'volumeUp is not supported' );
  }

  volumeDown()
  {
    console.log( 'volumeDown is not supported' );
  }

  openContentLink( contentLink: string )
  {
    window.location.href = contentLink;
  }
}

( function()
{
  chrome.storage.sync.get( null, function( settings )
  {
    Controller.settings = settings;
  } );

  chrome.storage.onChanged.addListener( function( changes )
  {
    for( let setting in changes )
    {
      Controller.settings[ setting ] = changes[ setting ].newValue;
    }
  } );
} )();

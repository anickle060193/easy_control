export default class Controller
{
  public playButtonSelector: string | null = null;
  public pauseButtonSelector: string | null = null;

  public mediaSelector: string | null = null;

  public playButton = (): HTMLElement | null => this.playButtonSelector ? document.querySelector<HTMLElement>( this.playButtonSelector ) : null;
  public pauseButton = (): HTMLElement | null => this.pauseButtonSelector ? document.querySelector<HTMLElement>( this.pauseButtonSelector ) : null;

  public media = (): HTMLMediaElement | null => this.mediaSelector ? document.querySelector<HTMLMediaElement>( this.mediaSelector ) : null;

  public useMediaForIsPlaying = false;

  public isPlaying = (): boolean =>
  {
    if( this.useMediaForIsPlaying )
    {
      const media = this.media();
      if( !media )
      {
        console.warn( 'Could not find media element for isPlaying:', this.mediaSelector );
        return true;
      }

      return !media.paused;
    }

    if( this.playButtonSelector )
    {
      const playButton = this.playButton();
      return !playButton || !playButton.offsetParent;
    }

    if( this.pauseButtonSelector )
    {
      const pauseButton = this.pauseButton();
      return !!pauseButton && !!pauseButton.offsetParent;
    }

    return true;
  }

  public useMediaForPlay = false;

  public play = (): void =>
  {
    if( this.useMediaForPlay )
    {
      const media = this.media();
      if( !media )
      {
        console.warn( 'Could not find media element for play():', this.mediaSelector );
        return;
      }

      void media.play();
    }
    else
    {
      const playButton = this.playButton();
      if( !playButton )
      {
        console.warn( 'Could not find play button for play():', this.playButtonSelector );
        return;
      }

      playButton.click();
    }
  }

  public useMediaForPause = false;

  public pause = (): void =>
  {
    if( this.useMediaForPause )
    {
      const media = this.media();
      if( !media )
      {
        console.warn( 'Could not find media element for pause():', this.mediaSelector );
        return;
      }

      void media.pause();
    }
    else
    {
      const pauseButton = this.pauseButton();
      if( !pauseButton )
      {
        console.warn( 'Could not find pause button for pause():', this.pauseButtonSelector );
        return;
      }

      pauseButton.click();
    }
  }

  public useDocumentMediaEventsForPolling = false;
  public useMediaForPolling = false;
  public useMutationObserverForPolling = false;

  public playerSelector: string | null = null;

  public player = (): HTMLElement | null => this.playerSelector ? document.querySelector<HTMLElement>( this.playerSelector ) : null;

  public registerListener = ( callback: () => void ): ( () => void ) =>
  {
    if( this.useDocumentMediaEventsForPolling )
    {
      document.addEventListener( 'timeupdate', callback, { capture: true } );
      document.addEventListener( 'play', callback, { capture: true } );
      document.addEventListener( 'pause', callback, { capture: true } );

      return () =>
      {
        document.removeEventListener( 'timeupdate', callback, { capture: true } );
        document.removeEventListener( 'play', callback, { capture: true } );
        document.removeEventListener( 'pause', callback, { capture: true } );
      };
    }
    else if( this.useMediaForPolling )
    {
      const media = this.media();
      if( !media )
      {
        console.warn( 'Could not find media element for registerListener():', this.mediaSelector );
        return () => void 0;
      }

      media.addEventListener( 'timeupdate', callback );
      media.addEventListener( 'play', callback );
      media.addEventListener( 'pause', callback );

      return () =>
      {
        media.removeEventListener( 'timeupdate', callback );
        media.removeEventListener( 'play', callback );
        media.removeEventListener( 'pause', callback );
      };
    }
    else if( this.useMutationObserverForPolling )
    {
      const player = this.player();
      if( !player )
      {
        console.warn( 'Could not find player element for registerListener():', this.playerSelector );
        return () => void 0;
      }

      const observer = new MutationObserver( callback );
      observer.observe( player, { subtree: true, childList: true, attributes: true } );

      return () => observer.disconnect();
    }
    else
    {
      const intervalId = window.setInterval( callback, 500 );

      return () => window.clearInterval( intervalId );
    }
  }
}

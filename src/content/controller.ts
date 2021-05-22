import { ContentMessageId, UpdateContentMessage } from '../common/contentMessages';
import { DEFAULT_CONTROLLER_CAPABILITIES, DEFAULT_CONTROLLER_MEDIA, DEFAULT_CONTROLLER_STATUS } from '../common/controllers';
import { EventEmitter } from '../common/EventEmitter';

import { Controls } from './Controls';
import { querySelector, Selector } from './selector';
import { extractImageDataUrlFromVideo } from './util';

export interface ControllerOptions
{
  isEnabledElementSelector: Selector | null;
  useMediaForIsEnabled: boolean;
  usePlayPauseButtonsForIsEnabled: boolean;

  mediaSelector: Selector | null;

  playButtonSelector: Selector | null;
  pauseButtonSelector: Selector | null;

  useMediaSessionForIsPlaying: boolean;
  useMediaForIsPlaying: boolean;
  usePlayButtonForPlaying: boolean;
  usePauseButtonForPlaying: boolean;

  usePlayButtonForPlay: boolean;
  useMediaForPlay: boolean;

  usePauseButtonForPause: boolean;
  useMediaForPause: boolean;

  nextSelector: Selector | null;
  previousSelector: Selector | null;
  skipFowardSelector: Selector | null;
  skipBackwardSelector: Selector | null;
  likeSelector: Selector | null;
  unlikeSelector: Selector | null;
  dislikeSelector: Selector | null;
  undislikeSelector: Selector | null;

  volumeSelector: Selector | null;

  useMediaForSkipping: boolean;
  useMediaForVolume: boolean;

  useDocumentMediaEventsForPolling: boolean;
  useMediaForPolling: boolean;
  useMutationObserverForPolling: boolean;

  playerSelector: Selector | null;

  useMediaSessionForTrack: boolean;
  useMediaSessionForAlbum: boolean;
  useMediaSessionForArtist: boolean;
  useMediaSessionForArtwork: boolean;

  trackSelector: Selector | null;
  albumSelector: Selector | null;
  artistSelector: Selector | null;
  artworkSelector: Selector | null;

  useMediaForArtwork: boolean;

  useMediaForTime: boolean;

  currentTimeSelector: Selector | null;
  remainingTimeSelector: Selector | null;
  durationSelector: Selector | null;

  currentTimeFormat: RegExp | null;
  remainingTimeFormat: RegExp | null;
  durationFormat: RegExp | null;
}

export const DEFAULT_OPTIONS: ControllerOptions = {
  isEnabledElementSelector: null,
  useMediaForIsEnabled: false,
  usePlayPauseButtonsForIsEnabled: false,

  mediaSelector: null,

  playButtonSelector: null,
  pauseButtonSelector: null,

  useMediaSessionForIsPlaying: false,
  useMediaForIsPlaying: false,
  usePlayButtonForPlaying: false,
  usePauseButtonForPlaying: false,

  usePlayButtonForPlay: false,
  useMediaForPlay: false,

  usePauseButtonForPause: false,
  useMediaForPause: false,

  nextSelector: null,
  previousSelector: null,
  skipFowardSelector: null,
  skipBackwardSelector: null,
  likeSelector: null,
  unlikeSelector: null,
  dislikeSelector: null,
  undislikeSelector: null,

  volumeSelector: null,

  useMediaForSkipping: false,
  useMediaForVolume: false,

  useDocumentMediaEventsForPolling: false,
  useMediaForPolling: false,
  useMutationObserverForPolling: false,

  playerSelector: null,

  useMediaSessionForTrack: false,
  useMediaSessionForAlbum: false,
  useMediaSessionForArtist: false,
  useMediaSessionForArtwork: false,

  trackSelector: null,
  albumSelector: null,
  artistSelector: null,
  artworkSelector: null,

  useMediaForArtwork: false,

  useMediaForTime: false,

  currentTimeSelector: null,
  remainingTimeSelector: null,
  durationSelector: null,

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,
};

export const DEFAULT_TIME_FORMAT = /(\d+):(\d+)/;

export default class Controller
{
  public readonly onUpdate = new EventEmitter<[ UpdateContentMessage ]>();

  private readonly controls = new Controls( this );

  private stopCallback: ( () => void ) | null = null;

  public constructor(
    public options: ControllerOptions
  )
  {
  }

  public getUpdateMessage = (): UpdateContentMessage =>
  {
    if( !this.isEnabled() )
    {
      return {
        id: ContentMessageId.Update,
        status: DEFAULT_CONTROLLER_STATUS,
        mediaChangedIndication: null,
        media: DEFAULT_CONTROLLER_MEDIA,
        capabilities: DEFAULT_CONTROLLER_CAPABILITIES,
      };
    }
    else
    {
      const indication = this.getMediaChangedIndication();
      let mediaChangedIndication: string | null;
      if( indication.some( ( s ) => typeof s !== 'string' ) )
      {
        mediaChangedIndication = null;
      }
      else
      {
        mediaChangedIndication = indication.join( '::' );
      }

      return {
        id: ContentMessageId.Update,
        status: {
          enabled: true,
          playing: this.isPlaying(),
          progress: this.getProgress(),
          volume: this.getVolume(),
        },
        mediaChangedIndication,
        media: {
          track: this.getTrack(),
          artist: this.getArtist(),
          album: this.getAlbum(),
          artwork: this.getArtwork(),
          liked: this.isLiked(),
          disliked: this.isDisliked(),
        },
        capabilities: {
          next: this.canNext(),
          previous: this.canPrevious(),
          skipBackward: this.canSkipBackward(),
          skipForward: this.canSkipForward(),
          like: this.canLike(),
          unlike: this.canUnlike(),
          dislike: this.canDislike(),
          undislike: this.canUndislike(),
          volume: this.canVolume(),
        },
      };
    }
  }

  private onUpdateCallback = () =>
  {
    const updateMessage = this.getUpdateMessage();

    this.onUpdate.dispatch( updateMessage );

    this.controls.update( this.findMediaElement(), updateMessage );
  }

  private onStart = (): ( () => void ) =>
  {
    if( this.options.useDocumentMediaEventsForPolling )
    {
      document.addEventListener( 'timeupdate', this.onUpdateCallback, { capture: true } );
      document.addEventListener( 'play', this.onUpdateCallback, { capture: true } );
      document.addEventListener( 'pause', this.onUpdateCallback, { capture: true } );

      return () =>
      {
        document.removeEventListener( 'timeupdate', this.onUpdateCallback, { capture: true } );
        document.removeEventListener( 'play', this.onUpdateCallback, { capture: true } );
        document.removeEventListener( 'pause', this.onUpdateCallback, { capture: true } );
      };
    }

    if( this.options.useMediaForPolling )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for registerListener():', this.options.mediaSelector );
      }
      else
      {
        media.addEventListener( 'timeupdate', this.onUpdateCallback );
        media.addEventListener( 'play', this.onUpdateCallback );
        media.addEventListener( 'pause', this.onUpdateCallback );

        return () =>
        {
          media.removeEventListener( 'timeupdate', this.onUpdateCallback );
          media.removeEventListener( 'play', this.onUpdateCallback );
          media.removeEventListener( 'pause', this.onUpdateCallback );
        };
      }
    }

    if( this.options.useMutationObserverForPolling )
    {
      const player = this.findPlayer();
      if( !player )
      {
        console.warn( 'Could not find player element for registerListener():', this.options.playerSelector );
      }
      else
      {
        const observer = new MutationObserver( this.onUpdateCallback );
        observer.observe( player, { subtree: true, childList: true, attributes: true } );

        return () =>
        {
          observer.disconnect();
        };
      }
    }

    const intervalId = window.setInterval( () =>
    {
      this.onUpdateCallback();
    }, 500 );

    return () =>
    {
      window.clearInterval( intervalId );
    };
  }

  public start(): void
  {
    if( this.stopCallback )
    {
      console.warn( 'Controller is already running.' );
      return;
    }

    this.stopCallback = this.onStart();
  }

  public stop(): void
  {
    this.stopCallback?.();

    this.controls.remove();
  }

  public isEnabled = (): boolean =>
  {
    if( this.options.useMediaForIsEnabled )
    {
      if( this.findMediaElement() )
      {
        return true;
      }
    }

    if( this.options.usePlayPauseButtonsForIsEnabled )
    {
      if( this.findPlayButton() || this.findPauseButton() )
      {
        return true;
      }
    }

    if( this.options.isEnabledElementSelector !== null )
    {
      if( querySelector( this.options.isEnabledElementSelector ) )
      {
        return true;
      }
    }

    return false;
  }

  public findPlayButton = (): HTMLElement | null => querySelector( this.options.playButtonSelector );
  public findPauseButton = (): HTMLElement | null => querySelector( this.options.pauseButtonSelector );

  public findMediaElement = (): HTMLMediaElement | null =>
  {
    if( this.options.mediaSelector === null )
    {
      return null;
    }

    const m = querySelector( this.options.mediaSelector );
    if( !( m instanceof HTMLMediaElement ) )
    {
      console.warn( 'Media selector did not select a media element:', this.options.mediaSelector, m );
      return null;
    }

    return m;
  }

  public isPlaying = (): boolean =>
  {
    if( this.options.useMediaForIsPlaying )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for isPlaying:', this.options.mediaSelector );
      }
      else
      {
        return !media.paused;
      }
    }

    if( this.options.useMediaSessionForIsPlaying )
    {
      if( window.navigator.mediaSession
        && window.navigator.mediaSession.playbackState !== 'none' )
      {
        return window.navigator.mediaSession.playbackState === 'playing';
      }
    }

    if( this.options.usePlayButtonForPlaying )
    {
      const playButton = this.findPlayButton();
      return !playButton || !playButton.offsetParent;
    }

    if( this.options.usePauseButtonForPlaying )
    {
      const pauseButton = this.findPauseButton();
      return !!pauseButton && !!pauseButton.offsetParent;
    }

    return false;
  }

  public performPlay = (): void =>
  {
    if( this.options.usePlayButtonForPlay )
    {
      const playButton = this.findPlayButton();
      if( !playButton )
      {
        console.warn( 'Could not find play button for play():', this.options.playButtonSelector );
      }
      else
      {
        playButton.click();
        return;
      }
    }

    if( this.options.useMediaForPlay )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for play():', this.options.mediaSelector );
      }
      else
      {
        void media.play();
        return;
      }
    }
  }

  public performPause = (): void =>
  {
    if( this.options.usePauseButtonForPause )
    {
      const pauseButton = this.findPauseButton();
      if( pauseButton )
      {
        pauseButton.click();
        return;
      }

      console.warn( 'Could not find pause button for pause():', this.options.pauseButtonSelector );
    }

    if( this.options.useMediaForPause )
    {
      const media = this.findMediaElement();
      if( media )
      {
        void media.pause();
        return;
      }

      console.warn( 'Could not find media element for pause():', this.options.mediaSelector );
    }
  }

  public performPlayPause = (): void =>
  {
    if( this.isPlaying() )
    {
      this.performPause();
    }
    else
    {
      this.performPlay();
    }
  }

  public findPlayer = (): HTMLElement | null => querySelector( this.options.playerSelector );

  public getMediaMetaData = (): MediaMetadata | null => window.navigator.mediaSession?.metadata ?? null;

  public getTrack = (): string | null =>
  {
    if( this.options.useMediaSessionForTrack )
    {
      const metaData = this.getMediaMetaData();
      if( !metaData?.title )
      {
        console.warn( 'Media session had no track title:', metaData );
      }
      else
      {
        return metaData.title;
      }
    }

    if( this.options.trackSelector !== null )
    {
      const trackElement = querySelector( this.options.trackSelector );
      if( !trackElement )
      {
        console.warn( 'Could not find track element:', this.options.trackSelector );
      }
      else
      {
        const track = trackElement.textContent?.trim();
        if( !track )
        {
          console.warn( 'Track element has no text:', trackElement );
        }
        else
        {
          return track;
        }
      }
    }

    return null;
  }

  public getAlbum = (): string | null =>
  {
    if( this.options.useMediaSessionForAlbum )
    {
      const metaData = this.getMediaMetaData();
      if( !metaData?.album )
      {
        console.warn( 'Media session had no album:', metaData );
      }
      else
      {
        return metaData.album;
      }
    }

    if( this.options.albumSelector !== null )
    {
      const albumElement = querySelector( this.options.albumSelector );
      if( !albumElement )
      {
        console.warn( 'Could not find album element:', this.options.albumSelector );
      }
      else
      {
        const album = albumElement.textContent?.trim();
        if( !album )
        {
          console.warn( 'Album element has no text:', albumElement );
        }
        else
        {
          return album;
        }
      }
    }

    return null;
  }

  public getArtist = (): string | null =>
  {
    if( this.options.useMediaSessionForArtist )
    {
      const metaData = this.getMediaMetaData();
      if( !metaData?.artist )
      {
        console.warn( 'Media session had no artist:', metaData );
      }
      else
      {
        return metaData.artist;
      }
    }

    if( this.options.artistSelector !== null )
    {
      const artistElement = querySelector( this.options.artistSelector );
      if( !artistElement )
      {
        console.warn( 'Could not find artist element:', this.options.artistSelector );
      }
      else
      {
        const artist = artistElement.textContent?.trim();
        if( !artist )
        {
          console.warn( 'Artist element has no text:', artistElement );
        }
        else
        {
          return artist;
        }
      }
    }

    return null;
  }

  public getArtwork = (): string | null =>
  {
    if( this.options.useMediaSessionForArtwork )
    {
      const metaData = this.getMediaMetaData();
      if( !metaData?.artwork?.[ 0 ]?.src )
      {
        console.warn( 'Media session had no artwork:', metaData );
      }
      else
      {
        return metaData.artwork[ 0 ].src;
      }
    }

    if( this.options.artworkSelector !== null )
    {
      const artworkElement = querySelector( this.options.artworkSelector );
      if( !artworkElement )
      {
        console.warn( 'Could not find artwork element:', this.options.artworkSelector );
      }
      else if( !( artworkElement instanceof HTMLImageElement ) )
      {
        console.warn( 'Artwork element is not an image:', this.options.artworkSelector, artworkElement );
      }
      else
      {
        const artwork = artworkElement.currentSrc;
        if( artwork )
        {
          return artwork;
        }
      }
    }

    if( this.options.useMediaForArtwork )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for getArtwork():', this.options.mediaSelector );
      }
      else if( !( media instanceof HTMLVideoElement ) )
      {
        console.warn( 'Only video elements can be used for getArtwork():', media );
      }
      else if( media.poster )
      {
        return media.poster;
      }
      else
      {
        const frameUrl = extractImageDataUrlFromVideo( media );
        if( frameUrl )
        {
          return frameUrl;
        }
      }
    }

    return null;
  }

  public getMediaChangedIndication = (): ( string | null | undefined )[] => [ this.getTrack() ];

  public findLikeButton = (): HTMLElement | null => querySelector( this.options.likeSelector );
  public findUnlikeButton = (): HTMLElement | null => querySelector( this.options.unlikeSelector );
  public findDislikeButton = (): HTMLElement | null => querySelector( this.options.dislikeSelector );
  public findUndislikeButton = (): HTMLElement | null => querySelector( this.options.undislikeSelector );

  public isLiked = (): boolean =>
  {
    return this.findUnlikeButton() !== null;
  }

  public isDisliked = (): boolean =>
  {
    return this.findUndislikeButton() !== null;
  }

  public canLike = (): boolean => this.findLikeButton() !== null;

  public performLike = (): void =>
  {
    this.findLikeButton()?.click();
  }

  public canUnlike = (): boolean => this.findUnlikeButton() !== null;

  public performUnlike = (): void =>
  {
    this.findUnlikeButton()?.click();
  }

  public canDislike = (): boolean => this.findDislikeButton() !== null;

  public performDislike = (): void =>
  {
    this.findDislikeButton()?.click();
  }

  public canUndislike = (): boolean => this.findUndislikeButton() !== null;

  public performUndislike = (): void =>
  {
    this.findUndislikeButton()?.click();
  }

  public parseTime = ( name: string, selector: Selector, format: RegExp ): number | null =>
  {
    const timeElement = querySelector( selector );
    if( !timeElement )
    {
      console.warn( 'Could not find', name, ':', selector );
      return null;
    }

    const timeText = timeElement.textContent?.trim() ?? '';

    const match = format.exec( timeText );
    if( !match )
    {
      console.warn( 'Time format did not match time for', name, ':', timeText, format );
      return null;
    }

    const minutes = parseInt( match[ 1 ] ?? '', 10 );
    const seconds = parseInt( match[ 2 ] ?? '', 10 );

    return minutes * 60 + seconds;
  }

  public getCurrentTime = (): number | null =>
  {
    if( this.options.useMediaForTime )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for currentTime():', this.options.mediaSelector );
      }
      else
      {
        return media.currentTime;
      }
    }

    if( this.options.currentTimeSelector !== null )
    {
      const currentTime = this.parseTime( 'currentTime()', this.options.currentTimeSelector, this.options.currentTimeFormat ?? DEFAULT_TIME_FORMAT );
      if( typeof currentTime !== 'number' )
      {
        console.log( 'Failed to determine current time.' );
      }
      else
      {
        return currentTime;
      }
    }

    return null;
  }

  public getRemainingTime = (): number | null =>
  {
    if( this.options.useMediaForTime )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for remainingTime():', this.options.mediaSelector );
      }
      else
      {
        return media.duration - media.currentTime;
      }
    }

    if( this.options.remainingTimeSelector !== null )
    {
      const remainingTime = this.parseTime( 'remainingTime()', this.options.remainingTimeSelector, this.options.remainingTimeFormat ?? DEFAULT_TIME_FORMAT );
      if( typeof remainingTime !== 'number' )
      {
        console.warn( 'Failed to determine remaining time.' );
      }
      else
      {
        return remainingTime;
      }
    }

    return null;
  }

  public getDuration = (): number | null =>
  {
    if( this.options.useMediaForTime )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for duration():', this.options.mediaSelector );
      }
      else
      {
        return media.duration;
      }
    }

    if( this.options.durationSelector !== null )
    {
      const duration = this.parseTime( 'duration()', this.options.durationSelector, this.options.durationFormat ?? DEFAULT_TIME_FORMAT );
      if( typeof duration !== 'number' )
      {
        console.warn( 'Could not determine duration.' );
      }
      else
      {
        return duration;
      }
    }

    return null;
  }

  public getProgress = (): number =>
  {
    const currentTime = this.getCurrentTime();
    const remainingTime = this.getRemainingTime();
    const duration = this.getDuration();

    if( typeof currentTime === 'number'
      && isFinite( currentTime )
      && typeof duration === 'number'
      && isFinite( duration ) )
    {
      if( duration === 0 )
      {
        return 0;
      }
      else
      {
        return currentTime / duration;
      }
    }
    else if( typeof currentTime === 'number'
      && isFinite( currentTime )
      && typeof remainingTime === 'number'
      && isFinite( remainingTime ) )
    {
      const dur = currentTime + remainingTime;
      if( dur === 0 )
      {
        return 0;
      }
      else
      {
        return currentTime / dur;
      }
    }
    else if( typeof remainingTime === 'number'
      && isFinite( remainingTime )
      && typeof duration === 'number'
      && isFinite( duration ) )
    {
      const cur = duration - remainingTime;
      if( duration === 0 )
      {
        return 0;
      }
      else
      {
        return cur / duration;
      }
    }
    else
    {
      return 0;
    }
  }

  public findNextButton = (): HTMLElement | null => querySelector( this.options.nextSelector );

  public canNext = (): boolean => this.findNextButton() !== null;

  public performNext = (): void =>
  {
    this.findNextButton()?.click();
  }

  public findPreviousButton = (): HTMLElement | null => querySelector( this.options.previousSelector );

  public canPrevious = (): boolean => this.findPreviousButton() !== null;

  public performPrevious = (): void =>
  {
    this.findPreviousButton()?.click();
  }

  public findSkipForwardButton = (): HTMLElement | null => querySelector( this.options.skipFowardSelector );

  public canSkipForward = (): boolean =>
  {
    if( this.options.useMediaForSkipping )
    {
      const media = this.findMediaElement();
      if( media )
      {
        return true;
      }
    }

    if( this.findSkipForwardButton() )
    {
      return true;
    }

    return false;
  }

  public performSkipForward = (): void =>
  {
    if( this.options.useMediaForSkipping )
    {
      const media = this.findMediaElement();
      if( media )
      {
        media.currentTime += 10;
        return;
      }
    }

    this.findSkipForwardButton()?.click();
  }

  public findSkipBackwardButton = (): HTMLElement | null => querySelector( this.options.skipBackwardSelector );

  public canSkipBackward = (): boolean =>
  {
    if( this.options.useMediaForSkipping )
    {
      const media = this.findMediaElement();
      if( media )
      {
        return true;
      }
    }

    if( this.findSkipBackwardButton() )
    {
      return true;
    }

    return false;
  }

  public performSkipBackward = (): void =>
  {
    if( this.options.useMediaForSkipping )
    {
      const media = this.findMediaElement();
      if( media )
      {
        media.currentTime -= 10;
        return;
      }
    }

    this.findSkipBackwardButton()?.click();
  }

  public findVolumeElement = (): HTMLElement | null => querySelector( this.options.volumeSelector );

  public canVolume = (): boolean =>
  {
    if( this.options.useMediaForVolume )
    {
      return this.findMediaElement() !== null;
    }

    return false;
  }

  public getVolume = (): number =>
  {
    if( this.options.useMediaForVolume )
    {
      const media = this.findMediaElement();
      if( !media )
      {
        console.warn( 'Could not find media element for volume:', this.options.mediaSelector );
      }
      else
      {
        return media.volume;
      }
    }

    const volume = parseFloat( this.findVolumeElement()?.textContent ?? '' );
    if( isFinite( volume ) )
    {
      return volume / 100;
    }

    return 0.0;
  }

  public performVolumeUp = (): void =>
  {
    if( this.options.useMediaForVolume )
    {
      const media = this.findMediaElement();
      if( media )
      {
        media.volume += 0.05;
      }
    }
  }

  public performVolumeDown = (): void =>
  {
    if( this.options.useMediaForVolume )
    {
      const media = this.findMediaElement();
      if( media )
      {
        media.volume -= 0.05;
      }
    }
  }
}

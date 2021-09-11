import Controller from '../controller';

export class GenericAudioVideoController extends Controller
{
  constructor( media: HTMLMediaElement )
  {
    super( {
      isEnabledElementSelector: null,
      useMediaForIsEnabled: true,
      usePlayPauseButtonsForIsEnabled: false,

      mediaSelector: media,

      playButtonSelector: null,
      pauseButtonSelector: null,

      useMediaSessionForIsPlaying: false,
      useMediaForIsPlaying: true,
      usePlayButtonForPlaying: false,
      usePauseButtonForPlaying: false,

      usePlayButtonForPlay: false,
      useMediaForPlay: true,

      usePauseButtonForPause: false,
      useMediaForPause: true,

      nextSelector: null,
      previousSelector: null,
      skipFowardSelector: null,
      skipBackwardSelector: null,
      likeSelector: null,
      unlikeSelector: null,
      dislikeSelector: null,
      undislikeSelector: null,

      volumeSelector: null,

      useMediaForSkipping: true,
      useMediaForVolume: true,

      useDocumentMediaEventsForPolling: false,
      useMediaForPolling: true,
      useMutationObserverForPolling: false,

      playerSelector: null,

      useMediaSessionForTrack: true,
      useMediaSessionForAlbum: true,
      useMediaSessionForArtist: true,
      useMediaSessionForArtwork: true,

      trackSelector: null,
      albumSelector: null,
      artistSelector: null,
      artworkSelector: null,

      useMediaForArtwork: media instanceof HTMLVideoElement,

      useMediaForTime: true,

      currentTimeSelector: null,
      remainingTimeSelector: null,
      durationSelector: null,

      currentTimeFormat: null,
      remainingTimeFormat: null,
      durationFormat: null,

      controlsContainer: null,

      enterFullscreenButtonSelector: null,
      exitFullscreenButtonSelector: null,
      fullscreenElementSelector: null,
      useControlsContainerForFullscreen: false,
      useMediaForFullscreen: true,
    } );
  }
}

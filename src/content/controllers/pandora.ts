import Controller from '../controller';

export const controller = new Controller( {
  isEnabledElementSelector: null,
  useMediaForIsEnabled: false,
  usePlayPauseButtonsForIsEnabled: true,

  mediaSelector: null,

  playButtonSelector: 'button.Tuner__Control__Play__Button[data-qa="play_button"]',
  pauseButtonSelector: 'button.Tuner__Control__Play__Button[data-qa="pause_button"]',

  useMediaForIsPlaying: false,
  useMediaSessionForIsPlaying: false,
  usePlayButtonForPlaying: true,
  usePauseButtonForPlaying: true,

  usePlayButtonForPlay: true,
  useMediaForPlay: false,

  usePauseButtonForPause: true,
  useMediaForPause: false,

  nextSelector: 'button.SkipButton',
  previousSelector: null,
  skipFowardSelector: null,
  skipBackwardSelector: null,
  likeSelector: '.ThumbUpButton:not( .ThumbUpButton--active )',
  unlikeSelector: '.ThumbUpButton.ThumbUpButton--active',
  dislikeSelector: '.ThumbDownButton:not( .ThumbDownButton--active )',
  undislikeSelector: '.ThumbDownButton.ThumbDownButton--active',

  volumeSelector: '*[data-qa="volume_slider_handle"]',
  volumeAttribute: 'aria-valuenow',

  useMediaForSkipping: false,
  useMediaForVolume: false,

  useDocumentMediaEventsForPolling: false,
  useMediaForPolling: false,
  useMutationObserverForPolling: true,

  playerSelector: null,

  useMediaSessionForTrack: false,
  useMediaSessionForAlbum: false,
  useMediaSessionForArtist: false,
  useMediaSessionForArtwork: false,

  trackSelector: [ '.Tuner__Audio__TrackDetail__title', '.nowPlayingTopInfo__current__trackName .Marquee__wrapper__content__child:first-child', '.nowPlayingTopInfo__current__trackName' ],
  albumSelector: '.nowPlayingTopInfo__current__albumName',
  artistSelector: [ '.Tuner__Audio__TrackDetail__artist', '.NowPlayingTopInfo__current__artistName' ],
  artworkSelector: [ '.Tuner__Audio__TrackDetail__img img', '.NowPlayinfTopInfo__artContainer__img' ],

  useMediaForArtwork: false,

  useMediaForTime: false,

  currentTimeSelector: 'span[data-qa="elapsed_time"]',
  remainingTimeSelector: null,
  durationSelector: 'span[data-qa="remaining_time"]',

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,

  controlsContainer: null,

  enterFullscreenButtonSelector: null,
  exitFullscreenButtonSelector: null,
  fullscreenElementSelector: null,
  useControlsContainerForFullscreen: false,
  useMediaForFullscreen: false,
} );

const superGetArtwork = controller.getArtwork;
controller.getArtwork = () => superGetArtwork()?.replace( /\d+W_\d+H/, '500W_500H' ) ?? null;

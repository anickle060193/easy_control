import Controller from '../controller';

export const controller = new Controller( {
  isEnabledElementSelector: null,
  useMediaForIsEnabled: true,
  usePlayPauseButtonsForIsEnabled: true,

  mediaSelector: 'audio:last-of-type',

  playButtonSelector: 'button.Tuner__Control__Play__Button[data-qa="play_button"]',
  pauseButtonSelector: 'button.Tuner__Control__Play__Button[data-qa="pause_button"]',

  useMediaForIsPlaying: true,
  useMediaSessionForIsPlaying: false,
  usePlayButtonForPlaying: false,
  usePauseButtonForPlaying: false,

  usePlayButtonForPlay: true,
  useMediaForPlay: true,

  usePauseButtonForPause: true,
  useMediaForPause: true,

  nextSelector: 'button.SkipButton',
  previousSelector: null,
  skipFowardSelector: null,
  skipBackwardSelector: null,
  likeSelector: '.ThumbUpButton:not( .ThumbUpButton--active )',
  unlikeSelector: '.ThumbUpButton.ThumbUpButton--active',
  dislikeSelector: '.ThumbDownButton:not( .ThumbDownButton--active )',
  undislikeSelector: '.ThumbDownButton.ThumbDownButton--active',

  volumeSelector: null,

  useMediaForSkipping: false,
  useMediaForVolume: true,

  useDocumentMediaEventsForPolling: true,
  useMediaForPolling: false,
  useMutationObserverForPolling: false,

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
  useMediaForFullscreen: false,
} );

const superGetArtwork = controller.getArtwork;
controller.getArtwork = () => superGetArtwork()?.replace( /\d+W_\d+H/, '500W_500H' ) ?? null;

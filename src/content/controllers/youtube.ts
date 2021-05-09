import Controller from '../controller';

export const controller = new Controller( {
  isEnabledElementSelector: null,
  useMediaForIsEnabled: true,
  usePlayPauseButtonsForIsEnabled: false,

  mediaSelector: 'video',

  playButtonSelector: null,
  pauseButtonSelector: null,

  useMediaForIsPlaying: true,
  useMediaSessionForIsPlaying: true,
  usePlayButtonForPlaying: false,
  usePauseButtonForPlaying: false,

  usePlayButtonForPlay: false,
  useMediaForPlay: true,

  usePauseButtonForPause: false,
  useMediaForPause: true,

  nextSelector: '.ytp-next-button',
  previousSelector: '.ytp-prev-button',
  skipFowardSelector: null,
  skipBackwardSelector: null,
  likeSelector: '#info #top-level-buttons ytd-toggle-button-renderer:nth-child( 1 ) button[aria-pressed="false"]',
  unlikeSelector: '#info #top-level-buttons ytd-toggle-button-renderer:nth-child( 1 ) button[aria-pressed="true"]',
  dislikeSelector: '#info #top-level-buttons ytd-toggle-button-renderer:nth-child( 2 ) button[aria-pressed="false"]',
  undislikeSelector: '#info #top-level-buttons ytd-toggle-button-renderer:nth-child( 2 ) button[aria-pressed="true"]',

  volumeSelector: null,

  useMediaForSkipping: true,
  useMediaForVolume: true,

  useDocumentMediaEventsForPolling: true,
  useMediaForPolling: false,
  useMutationObserverForPolling: false,

  playerSelector: null,

  useMediaSessionForTrack: true,
  useMediaSessionForAlbum: false,
  useMediaSessionForArtist: true,
  useMediaSessionForArtwork: true,

  trackSelector: '#info-contents h1.title',
  albumSelector: null,
  artistSelector: '#primary #channel-name a',
  artworkSelector: '#meta-contents #avatar img',

  useMediaForArtwork: false,

  useMediaForTime: true,

  currentTimeSelector: null,
  remainingTimeSelector: null,
  durationSelector: null,

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,
} );

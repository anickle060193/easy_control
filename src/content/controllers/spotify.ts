import Controller from '../controller';

export const controller = new Controller( {
  isEnabledElementSelector: null,
  useMediaForIsEnabled: false,
  usePlayPauseButtonsForIsEnabled: true,

  mediaSelector: null,

  playButtonSelector: 'button[data-testid="control-button-play"]',
  pauseButtonSelector: 'button[data-testid="control-button-pause"]',

  useMediaForIsPlaying: false,
  useMediaSessionForIsPlaying: false,
  usePlayButtonForPlaying: true,
  usePauseButtonForPlaying: true,

  usePlayButtonForPlay: true,
  useMediaForPlay: false,

  usePauseButtonForPause: true,
  useMediaForPause: false,

  nextSelector: '.Root__now-playing-bar button[data-testid="control-button-skip-forward"]',
  previousSelector: [
    '.Root__now-playing-bar button[data-testid="control-button-skip-backward"]',
    '.Root__now-playing-bar .player-controls__buttons > button:nth-child( 2 )',
  ],
  skipFowardSelector: null,
  skipBackwardSelector: null,
  likeSelector: '.Root__now-playing-bar .control-button-heart button[aria-checked="false"]',
  unlikeSelector: '.Root__now-playing-bar .control-button-heart button[aria-checked="true"]',
  dislikeSelector: null,
  undislikeSelector: null,

  volumeSelector: null,

  useMediaForSkipping: false,
  useMediaForVolume: false,

  useDocumentMediaEventsForPolling: false,
  useMediaForPolling: false,
  useMutationObserverForPolling: true,

  playerSelector: '.Root__now-playing-bar .playback-bar',

  useMediaSessionForTrack: true,
  useMediaSessionForAlbum: true,
  useMediaSessionForArtist: true,
  useMediaSessionForArtwork: true,

  trackSelector: 'a[data-testid="nowplaying-track-link"]',
  albumSelector: null,
  artistSelector: 'a[data-testid="nowplaying-artist"]',
  artworkSelector: '.Root__now-playing-bar img.cover-art-image',

  useMediaForArtwork: false,

  useMediaForTime: false,

  currentTimeSelector: '.Root__now-playing-bar .playback-bar .playback-bar__progress-time',
  remainingTimeSelector: null,
  durationSelector: '.Root__now-playing-bar .playback-bar > :nth-child( 3 )',

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,
} );

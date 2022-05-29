import Controller from '../controller';

const PLAY_BUTTON_ICON_PATH = 'M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z';
const PAUSE_BUTTON_ICON_PATH = 'M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z';

export const controller = new Controller( {
  isEnabledElementSelector: null,
  useMediaForIsEnabled: false,
  usePlayPauseButtonsForIsEnabled: true,

  mediaSelector: null,

  playButtonSelector: `.Root__now-playing-bar button[data-testid="control-button-playpause"]:has( > svg > path[d="${PLAY_BUTTON_ICON_PATH}"] )`,
  pauseButtonSelector: `.Root__now-playing-bar button[data-testid="control-button-playpause"]:has( > svg > path[d="${PAUSE_BUTTON_ICON_PATH}"] )`,

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
  volumeAttribute: null,

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

  currentTimeSelector: [
    '.Root__now-playing-bar .playback-bar *[data-testid="playback-position"]',
    '.Root__now-playing-bar .playback-bar .playback-bar__progress-time-elapsed',
    '.Root__now-playing-bar .playback-bar .playback-bar__progress-time',
    '.Root__now-playing-bar .playback-bar > :nth-child( 1 )',
  ],
  remainingTimeSelector: null,
  durationSelector: [
    '.Root__now-playing-bar .playback-bar *[data-testid="playback-duration"]',
    '.Root__now-playing-bar .playback-bar > :nth-child( 3 )',
  ],

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

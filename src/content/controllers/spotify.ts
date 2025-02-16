import Controller from '../controller';
import { expandSelectors } from '../selector';

const CONTROLS_ROOT_SELECTORS = [
  '.Root__now-playing-bar',
  '.player-controls',
  '[data-testid="player-controls"]',
];

const PLAY_BUTTON_ICON_PATHS = [
  'M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z',
  'M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z',
];
const PAUSE_BUTTON_ICON_PATHS = [
  'M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z',
  'M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z',
];

export const controller = new Controller( {
  isEnabledElementSelector: null,
  useMediaForIsEnabled: false,
  usePlayPauseButtonsForIsEnabled: true,

  mediaSelector: null,

  playButtonSelector: [
    ...expandSelectors(
      CONTROLS_ROOT_SELECTORS,
      PLAY_BUTTON_ICON_PATHS.map( ( p ) => `button[data-testid="control-button-playpause"]:has( svg > path[d="${p}"] ):not( [disabled] )` )
    ),
  ],
  pauseButtonSelector: [
    ...expandSelectors(
      CONTROLS_ROOT_SELECTORS,
      PAUSE_BUTTON_ICON_PATHS.map( ( p ) => `button[data-testid="control-button-playpause"]:has( svg > path[d="${p}"] ):not( [disabled] )` )
    ),
  ],

  useMediaForIsPlaying: false,
  useMediaSessionForIsPlaying: false,
  usePlayButtonForPlaying: true,
  usePauseButtonForPlaying: true,

  usePlayButtonForPlay: true,
  useMediaForPlay: false,

  usePauseButtonForPause: true,
  useMediaForPause: false,

  nextSelector: expandSelectors( CONTROLS_ROOT_SELECTORS, 'button[data-testid="control-button-skip-forward"]' ),
  previousSelector: expandSelectors( CONTROLS_ROOT_SELECTORS, 'button[data-testid="control-button-skip-back"]' ),
  skipFowardSelector: null,
  skipBackwardSelector: null,
  likeSelector: '[data-testid="now-playing-widget"] button.control-button-heart[aria-checked="false"]',
  unlikeSelector: '[data-testid="now-playing-widget"] button.control-button-heart[aria-checked="true"]',
  dislikeSelector: null,
  undislikeSelector: null,

  volumeSelector: null,
  volumeAttribute: null,

  useMediaForSkipping: false,
  useMediaForVolume: false,

  useDocumentMediaEventsForPolling: false,
  useMediaForPolling: false,
  useMutationObserverForPolling: true,

  playerSelector: expandSelectors( CONTROLS_ROOT_SELECTORS, [ '.playback-bar', '[data-testid="progress-bar"]' ] ),

  useMediaSessionForTrack: true,
  useMediaSessionForAlbum: true,
  useMediaSessionForArtist: true,
  useMediaSessionForArtwork: true,

  trackSelector: null,
  albumSelector: null,
  artistSelector: null,
  artworkSelector: null,

  useMediaForArtwork: false,

  useMediaForTime: false,

  currentTimeSelector: [
    '.playback-bar .playback-bar__progress-time-elapsed',
    '.playback-bar [data-testid="playback-position"]',
    '[data-testid="player-controls"] [data-testid="playback-position"]',
  ],
  remainingTimeSelector: null,
  durationSelector: [
    '.playback-bar [data-testid="playback-duration"]',
    '[data-testid="player-controls"] [data-testid="playback-duration"]',
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

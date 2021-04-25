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

  useDocumentMediaEventsForPolling: false,
  useMediaForPolling: false,
  useMutationObserverForPolling: true,

  playerSelector: '.playback-bar',

  useMediaSessionForTrack: true,
  useMediaSessionForAlbum: true,
  useMediaSessionForArtist: true,
  useMediaSessionForArtwork: true,

  trackSelector: 'a[data-testid="nowplaying-track-link"]',
  albumSelector: null,
  artistSelector: 'a[data-testid="nowplaying-artist"]',
  artworkSelector: '.Root__now-playing-bar img.cover-art-image',

  useMediaForTime: false,

  currentTimeSelector: '.playback-bar .playback-bar__progress-time',
  remainingTimeSelector: null,
  durationSelector: '.playback-bar > :nth-child( 3 )',

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,
} );
